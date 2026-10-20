// Edge Function "simulado" — Simulados ENADE.
// Secrets necessários: GROQ_API_KEY. Opcionais: GROQ_TEXT_MODELS (lista separada por vírgula), GROQ_VISION_MODEL.
import { createClient } from "npm:@supabase/supabase-js@2";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const TEXT_MODELS = (Deno.env.get("GROQ_TEXT_MODELS") ?? "openai/gpt-oss-120b,openai/gpt-oss-20b")
  .split(",").map((s) => s.trim()).filter(Boolean);
const VISION_MODEL = Deno.env.get("GROQ_VISION_MODEL") ?? "qwen/qwen3.8-27b";

const TOPICOS = [
  "Formação Geral", "Algoritmos e Programação", "Estruturas de Dados", "Banco de Dados",
  "Engenharia de Software", "Redes de Computadores", "Sistemas Operacionais",
  "Arquitetura de Computadores", "Segurança da Informação", "Matemática e Lógica",
  "Teoria da Computação", "Gestão e Governança de TI", "Interação Humano-Computador e Web",
  "Inteligência Artificial e Dados", "Outros",
];
const LETRAS = ["A", "B", "C", "D", "E"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

interface Questao {
  key: string; examId: string; idx: number; n: number; curso: string; ano: number;
  area: string; imgs: string[]; ans: string | null; anulada: boolean;
}
interface Topico {
  key: string; topico: string; subtopico: string | null; resumo: string | null; explicacao: string | null;
}
interface Resposta {
  email: string; respostas: Record<string, string>; acertos: number; total: number;
  nota: number; ai_feedback: string | null;
}

class Falha extends Error {
  constructor(public codigo: string, mensagem: string, public extra: Record<string, unknown> = {}) {
    super(mensagem);
  }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const normEmail = (s: unknown) => String(s ?? "").trim().toLowerCase();
const normMatricula = (s: unknown) => String(s ?? "").replace(/[^0-9a-z]/gi, "").toUpperCase();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------- dados ----------

async function carregarSimulado(id: unknown) {
  if (typeof id !== "string" || !UUID_RE.test(id)) throw new Falha("nao_encontrado", "Simulado não encontrado.");
  const { data, error } = await db.from("simulados")
    .select("id, titulo, descricao, status, questoes, ai_analise, ai_analise_em")
    .eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Falha("nao_encontrado", "Simulado não encontrado.");
  return data as {
    id: string; titulo: string; descricao: string | null; status: string; questoes: Questao[];
    ai_analise: string | null; ai_analise_em: string | null;
  };
}

async function identificar(simuladoId: string, emailBruto: unknown, matriculaBruta: unknown) {
  const email = normEmail(emailBruto);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Falha("email_invalido", "Informe um email válido.");
  const { data, error } = await db.from("simulado_participantes")
    .select("nome, matricula").eq("simulado_id", simuladoId).eq("email", email).maybeSingle();
  if (error) throw error;
  if (!data) throw new Falha("nao_convidado", "Este email não está na lista de participantes deste simulado.");
  if (data.matricula && normMatricula(data.matricula) !== normMatricula(matriculaBruta)) {
    throw new Falha("matricula_invalida", "A matrícula não confere com a cadastrada para este email.");
  }
  return { email, nome: data.nome as string | null };
}

async function carregarTopicos(keys: string[]): Promise<Record<string, Topico>> {
  if (!keys.length) return {};
  const { data, error } = await db.from("enade_questao_topicos")
    .select("key, topico, subtopico, resumo, explicacao").in("key", keys);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((t: Topico) => [t.key, t]));
}

async function buscarResposta(simuladoId: string, email: string) {
  const { data, error } = await db.from("simulado_respostas")
    .select("email, respostas, acertos, total, nota, ai_feedback")
    .eq("simulado_id", simuladoId).eq("email", email).maybeSingle();
  if (error) throw error;
  return data as Resposta | null;
}

async function exigirEquipe(req: Request) {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  if (!data.user) throw new Falha("nao_autorizado", "Faça login no CMS.");
  const { data: perfil } = await db.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (!perfil || !["admin", "editor"].includes(perfil.role)) {
    throw new Falha("nao_autorizado", "Apenas admins e editores podem fazer isso.");
  }
}

// ---------- correção (espelha shared/simulado.ts) ----------

function topicoDe(q: Questao, topicos: Record<string, Topico>) {
  return topicos[q.key]?.topico ?? (q.area === "Formação Geral" ? "Formação Geral" : q.area || "Outros");
}

function corrigir(questoes: Questao[], respostas: Record<string, string>, topicos: Record<string, Topico>) {
  let acertos = 0;
  let total = 0;
  const porTopico = new Map<string, { topico: string; acertos: number; total: number }>();
  const erradas = [];
  for (const q of questoes) {
    if (q.anulada || !q.ans) continue;
    total++;
    const topico = topicoDe(q, topicos);
    const t = porTopico.get(topico) ?? { topico, acertos: 0, total: 0 };
    t.total++;
    const marcada = respostas[q.key] ?? null;
    if (marcada === q.ans) {
      acertos++;
      t.acertos++;
    } else {
      erradas.push({
        key: q.key, n: q.n, curso: q.curso, ano: q.ano, topico,
        subtopico: topicos[q.key]?.subtopico ?? null, resumo: topicos[q.key]?.resumo ?? null,
        explicacao: topicos[q.key]?.explicacao ?? null, marcada, correta: q.ans,
      });
    }
    porTopico.set(topico, t);
  }
  return {
    acertos,
    total,
    nota: total > 0 ? Math.round((acertos / total) * 10000) / 100 : 0,
    por_topico: [...porTopico.values()].sort((a, b) => a.acertos / a.total - b.acertos / b.total),
    erradas,
  };
}

async function montarResultado(questoes: Questao[], resp: Resposta) {
  const topicos = await carregarTopicos(questoes.map((q) => q.key));
  return { ...corrigir(questoes, resp.respostas ?? {}, topicos), ai_feedback: resp.ai_feedback };
}

// ---------- Groq ----------

async function groq(model: string, messages: unknown[], extra: Record<string, unknown>) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, ...extra }),
  });
  if (res.status === 429) {
    const texto = await res.text();
    const doTexto = Number(texto.match(/try again in ([\d.]+)s/)?.[1]);
    const espera = Number(res.headers.get("retry-after")) || doTexto || 20;
    throw new Falha("limite_ia", "A IA está com muitos pedidos agora.", { retry_after: Math.ceil(espera) });
  }
  if (!res.ok) throw new Error(`Groq ${model} ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const conteudo = String(data.choices?.[0]?.message?.content ?? "")
    .replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  if (!conteudo) throw new Error(`Groq ${model}: resposta vazia`);
  return conteudo;
}

async function gerarTexto(system: string, user: string) {
  let menorEspera = Infinity;
  for (const model of TEXT_MODELS) {
    try {
      return await groq(model, [{ role: "system", content: system }, { role: "user", content: user }], {
        temperature: 0.5,
        max_completion_tokens: 3000,
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
      });
    } catch (e) {
      if (e instanceof Falha && e.codigo === "limite_ia") {
        menorEspera = Math.min(menorEspera, Number(e.extra.retry_after) || 20);
        continue;
      }
      throw e;
    }
  }
  throw new Falha("limite_ia", "A IA está com muitos pedidos agora.", { retry_after: menorEspera });
}

const pct = (a: number, t: number) => (t > 0 ? Math.round((a / t) * 100) : 0);

// ---------- ações ----------

async function info(body: Record<string, unknown>) {
  const s = await carregarSimulado(body.simulado_id);
  return {
    titulo: s.titulo,
    descricao: s.descricao,
    status: s.status,
    total_questoes: s.questoes.filter((q) => !q.anulada).length,
  };
}

async function entrar(body: Record<string, unknown>) {
  const s = await carregarSimulado(body.simulado_id);
  const { email, nome } = await identificar(s.id, body.email, body.matricula);
  const resp = await buscarResposta(s.id, email);
  if (resp) return { estado: "respondido", nome, resultado: await montarResultado(s.questoes, resp) };
  if (s.status !== "aberto") return { estado: "fechado", nome };
  return {
    estado: "liberado",
    nome,
    questoes: s.questoes.map(({ ans: _ans, ...q }) => q),
  };
}

async function enviar(body: Record<string, unknown>) {
  const s = await carregarSimulado(body.simulado_id);
  const { email } = await identificar(s.id, body.email, body.matricula);
  if (s.status !== "aberto") throw new Falha("fechado", "Este simulado foi encerrado.");

  const recebidas = (body.respostas ?? {}) as Record<string, unknown>;
  const respostas: Record<string, string> = {};
  for (const q of s.questoes) {
    const v = recebidas[q.key];
    if (typeof v === "string" && LETRAS.includes(v)) respostas[q.key] = v;
  }

  const topicos = await carregarTopicos(s.questoes.map((q) => q.key));
  const r = corrigir(s.questoes, respostas, topicos);
  const { error } = await db.from("simulado_respostas").insert({
    simulado_id: s.id, email, respostas, acertos: r.acertos, total: r.total, nota: r.nota,
  });
  if (error?.code === "23505") {
    const existente = await buscarResposta(s.id, email);
    return { estado: "respondido", resultado: await montarResultado(s.questoes, existente!) };
  }
  if (error) throw error;
  return { estado: "respondido", resultado: { ...r, ai_feedback: null } };
}

async function feedback(body: Record<string, unknown>) {
  const s = await carregarSimulado(body.simulado_id);
  const { email, nome } = await identificar(s.id, body.email, body.matricula);
  const resp = await buscarResposta(s.id, email);
  if (!resp) throw new Falha("sem_resposta", "Você ainda não enviou este simulado.");
  if (resp.ai_feedback) return { feedback: resp.ai_feedback };

  const topicos = await carregarTopicos(s.questoes.map((q) => q.key));
  const r = corrigir(s.questoes, resp.respostas ?? {}, topicos);
  const acertadas = s.questoes
    .filter((q) => !q.anulada && q.ans && resp.respostas?.[q.key] === q.ans)
    .map((q) => `${topicoDe(q, topicos)}${topicos[q.key]?.subtopico ? ` / ${topicos[q.key]!.subtopico}` : ""}`);

  const system = `Você é um tutor que prepara estudantes de tecnologia da FAETERJ-Rio para o ENADE.
Escreva em português do Brasil, em markdown simples (títulos ##, listas com "-", negrito). Não use tabelas.
Regras:
- Use SOMENTE os dados fornecidos. Você não vê os enunciados nem o texto das alternativas: cite alternativas apenas pela letra e nunca afirme o que uma alternativa diz.
- Para explicar um erro, use o "resumo" e a "explicação do gabarito" da questão, quando houver.
- Em "Onde você foi bem", fale apenas dos tópicos/subtópicos das questões acertadas listadas.
- O aluno já vê um gráfico de acerto por tópico: não repita a lista de notas, comente o que ela revela.
- Seja direto e encorajador. Máximo de 400 palavras.`;
  const user = `Simulado: ${s.titulo}
Aluno: ${nome ?? "(sem nome)"}
Resultado: ${r.acertos} de ${r.total} (${r.nota}%)

Desempenho por tópico:
${r.por_topico.map((t) => `- ${t.topico}: ${t.acertos}/${t.total} (${pct(t.acertos, t.total)}%)`).join("\n")}

Questões acertadas (tópico / subtópico):
${acertadas.map((a) => `- ${a}`).join("\n") || "- nenhuma"}

Questões erradas:
${r.erradas.slice(0, 20).map((e, i) =>
    `- Q${e.n} (${e.curso} ${e.ano}) · ${e.topico}${e.subtopico ? ` / ${e.subtopico}` : ""}` +
    ` — marcou ${e.marcada ?? "em branco"}, gabarito ${e.correta}` +
    `${e.resumo ? `\n  Resumo: ${e.resumo}` : ""}` +
    `${e.explicacao && i < 12 ? `\n  Explicação do gabarito: ${e.explicacao.slice(0, 260)}` : ""}`
  ).join("\n") || "- nenhuma"}

Estruture assim:
## Seu desempenho (2 a 3 frases)
## Onde você foi bem
## Onde precisa melhorar (agrupe por tópico, cite as questões e o conceito que faltou)
## Plano de estudo (3 a 5 ações concretas, com conteúdos específicos para revisar)`;

  const texto = await gerarTexto(system, user);
  await db.from("simulado_respostas")
    .update({ ai_feedback: texto, ai_feedback_em: new Date().toISOString() })
    .eq("simulado_id", s.id).eq("email", email);
  return { feedback: texto };
}

async function classificar(req: Request, body: Record<string, unknown>) {
  await exigirEquipe(req);
  const key = String(body.key ?? "");
  if (!/^[\w-]+:\d+$/.test(key)) throw new Falha("dados_invalidos", "Questão inválida.");

  const { data: existente } = await db.from("enade_questao_topicos")
    .select("key, topico, subtopico, resumo, explicacao").eq("key", key).maybeSingle();
  if (existente) return existente;

  const imagens = (Array.isArray(body.imagens) ? body.imagens : [])
    .filter((i): i is string => typeof i === "string" && i.startsWith("data:image/"))
    .slice(0, 3);
  if (!imagens.length) throw new Falha("dados_invalidos", "Envie a imagem da questão.");
  const gabarito = typeof body.ans === "string" && LETRAS.includes(body.ans) ? body.ans : null;
  const formacaoGeral = body.area === "Formação Geral";

  const prompt = `Você está analisando uma questão do ENADE (área de Computação) a partir da imagem do enunciado.${
    gabarito ? ` O gabarito oficial é a alternativa ${gabarito}.` : ""
  }
Responda APENAS com um JSON no formato {"topico": string, "subtopico": string, "resumo": string, "explicacao": string}.
"topico" deve ser exatamente um destes: ${formacaoGeral ? "Formação Geral" : TOPICOS.join(" | ")}.
"subtopico": até 6 palavras. "resumo": uma frase dizendo o que a questão cobra.
"explicacao": ${
    gabarito
      ? `até 3 frases explicando por que a alternativa ${gabarito} é a correta e qual o conceito-chave, sem copiar o enunciado.`
      : `string vazia.`
  }`;

  const bruto = await groq(VISION_MODEL, [{
    role: "user",
    content: [{ type: "text", text: prompt }, ...imagens.map((url) => ({ type: "image_url", image_url: { url } }))],
  }], { temperature: 0.2, max_completion_tokens: 700 });

  const trecho = bruto.slice(bruto.indexOf("{"), bruto.lastIndexOf("}") + 1);
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(trecho);
  } catch {
    throw new Error(`Classificação ilegível para ${key}: ${bruto.slice(0, 200)}`);
  }
  const t = {
    key,
    topico: formacaoGeral
      ? "Formação Geral"
      : TOPICOS.includes(String(parsed.topico)) ? String(parsed.topico) : "Outros",
    subtopico: parsed.subtopico ? String(parsed.subtopico).slice(0, 80) : null,
    resumo: parsed.resumo ? String(parsed.resumo).slice(0, 300) : null,
    explicacao: gabarito && parsed.explicacao ? String(parsed.explicacao).slice(0, 600) : null,
    modelo: VISION_MODEL,
  };
  await db.from("enade_questao_topicos").upsert(t);
  return t;
}

async function analise(req: Request, body: Record<string, unknown>) {
  await exigirEquipe(req);
  const s = await carregarSimulado(body.simulado_id);
  if (s.ai_analise && !body.forcar) return { analise: s.ai_analise, gerada_em: s.ai_analise_em };

  const [{ data: respostas, error }, { count: convidados }] = await Promise.all([
    db.from("simulado_respostas").select("respostas, nota").eq("simulado_id", s.id),
    db.from("simulado_participantes").select("id", { count: "exact", head: true }).eq("simulado_id", s.id),
  ]);
  if (error) throw error;
  if (!respostas?.length) throw new Falha("sem_respostas", "Ainda não há respostas para analisar.");

  const topicos = await carregarTopicos(s.questoes.map((q) => q.key));
  const notas = respostas.map((r) => Number(r.nota)).sort((a, b) => a - b);
  const media = notas.reduce((a, b) => a + b, 0) / notas.length;
  const faixa = (min: number, max: number) => notas.filter((n) => n >= min && n < max).length;

  const porTopico = new Map<string, { acertos: number; total: number; questoes: number }>();
  const porQuestao = s.questoes.filter((q) => !q.anulada && q.ans).map((q) => {
    const marcas: Record<string, number> = {};
    let acertos = 0;
    for (const r of respostas) {
      const m = (r.respostas as Record<string, string>)[q.key] ?? "branco";
      if (m === q.ans) acertos++;
      else marcas[m] = (marcas[m] ?? 0) + 1;
    }
    const topico = topicoDe(q, topicos);
    const t = porTopico.get(topico) ?? { acertos: 0, total: 0, questoes: 0 };
    t.acertos += acertos;
    t.total += respostas.length;
    t.questoes++;
    porTopico.set(topico, t);
    const distrator = Object.entries(marcas).sort((a, b) => b[1] - a[1])[0];
    return { q, topico, taxa: pct(acertos, respostas.length), distrator, erros: respostas.length - acertos };
  });

  const descreve = (x: (typeof porQuestao)[number]) =>
    `- Q${x.q.n} (${x.q.curso} ${x.q.ano}) · ${x.topico}` +
    `${topicos[x.q.key]?.subtopico ? ` / ${topicos[x.q.key]!.subtopico}` : ""}` +
    `${topicos[x.q.key]?.resumo ? ` — ${topicos[x.q.key]!.resumo}` : ""} — ${x.taxa}% de acerto` +
    (!x.distrator
      ? ""
      : x.distrator[0] === "branco"
        ? `; ${pct(x.distrator[1], x.erros)}% dos erros foram respostas em branco`
        : `; ${pct(x.distrator[1], x.erros)}% dos erros concentrados numa mesma alternativa errada`);

  const ordenadas = [...porQuestao].sort((a, b) => a.taxa - b.taxa);
  const conceitos = ordenadas.slice(0, 6)
    .filter((x) => topicos[x.q.key]?.explicacao)
    .map((x) => `- Q${x.q.n}: ${topicos[x.q.key]!.explicacao!.slice(0, 260)}`);
  const system = `Você é um analista pedagógico que apoia a coordenação da FAETERJ-Rio na preparação para o ENADE.
Escreva em português do Brasil, em markdown simples (títulos ##, listas com "-", negrito).
Regras:
- Use SOMENTE os dados fornecidos e cite os números ao comparar.
- Você não conhece o texto das alternativas. Hipóteses sobre os erros devem vir do conceito-chave da questão e do padrão de respostas: erros concentrados numa mesma alternativa indicam um equívoco conceitual comum; muitos em branco indicam insegurança com o conteúdo.
- Seja concreto e enxuto: no máximo 4 recomendações. Máximo de 550 palavras.`;
  const user = `Simulado: ${s.titulo}
Participação: ${respostas.length} de ${convidados ?? "?"} convidados
Nota média: ${media.toFixed(1)}% · mediana: ${notas[Math.floor(notas.length / 2)].toFixed(1)}% · mínima: ${notas[0].toFixed(1)}% · máxima: ${notas[notas.length - 1].toFixed(1)}%
Distribuição: <40%: ${faixa(0, 40)} · 40–60%: ${faixa(40, 60)} · 60–80%: ${faixa(60, 80)} · ≥80%: ${faixa(80, 101)}

Acerto por tópico:
${[...porTopico.entries()].sort((a, b) => a[1].acertos / a[1].total - b[1].acertos / b[1].total)
    .map(([t, v]) => `- ${t}: ${pct(v.acertos, v.total)}% (${v.questoes} questões)`).join("\n")}

Questões com MENOR acerto:
${ordenadas.slice(0, 8).map(descreve).join("\n")}

Questões com MAIOR acerto:
${ordenadas.slice(-5).reverse().map(descreve).join("\n")}
${conceitos.length ? `\nConceito-chave das questões mais erradas (explicação do gabarito):\n${conceitos.join("\n")}\n` : ""}
Estruture assim:
## Visão geral
## Pontos críticos (tópicos e questões, com hipóteses a partir das respostas erradas mais comuns)
## Pontos fortes
## Recomendações para a coordenação (ações concretas: revisões, aulas de reforço, listas de exercícios)`;

  const texto = await gerarTexto(system, user);
  const agora = new Date().toISOString();
  await db.from("simulados").update({ ai_analise: texto, ai_analise_em: agora }).eq("id", s.id);
  return { analise: texto, gerada_em: agora };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    switch (body.action) {
      case "info": return json(await info(body));
      case "entrar": return json(await entrar(body));
      case "enviar": return json(await enviar(body));
      case "feedback": return json(await feedback(body));
      case "classificar": return json(await classificar(req, body));
      case "analise": return json(await analise(req, body));
      default: throw new Falha("acao_invalida", "Ação inválida.");
    }
  } catch (e) {
    if (e instanceof Falha) return json({ erro: e.codigo, mensagem: e.message, ...e.extra });
    console.error(e);
    return json({ erro: "interno", mensagem: "Erro interno. Tente novamente." }, 500);
  }
});
