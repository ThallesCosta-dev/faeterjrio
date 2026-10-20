import { supabase } from "@/lib/supabase";
import type { SimuladoQuestao } from "@shared/simulado";

export class SimuladoErro extends Error {
  constructor(public codigo: string, message: string, public retryAfter?: number) {
    super(message);
  }
}

export async function chamarSimulado<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("simulado", { body: { action, ...payload } });
  if (error) {
    throw new SimuladoErro("indisponivel", "Serviço de simulados indisponível no momento. Tente novamente em instantes.");
  }
  if (data?.erro) throw new SimuladoErro(data.erro, data.mensagem ?? "Erro inesperado.", data.retry_after);
  return data as T;
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries while the Groq free tier is rate-limited, reporting the countdown. */
export async function comRetentativa<T>(
  fn: () => Promise<T>,
  onEspera: (segundos: number) => void,
  maxTentativas = 8,
): Promise<T> {
  for (let tentativa = 0; ; tentativa++) {
    try {
      return await fn();
    } catch (e) {
      if (!(e instanceof SimuladoErro) || e.codigo !== "limite_ia" || tentativa >= maxTentativas) throw e;
      for (let s = Math.min(Math.max(e.retryAfter ?? 20, 3), 90); s > 0; s--) {
        onEspera(s);
        await esperar(1000);
      }
      onEspera(0);
    }
  }
}

async function imagemReduzida(url: string, larguraMax = 800): Promise<string> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const escala = Math.min(1, larguraMax / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * escala);
  canvas.height = Math.round(img.naturalHeight * escala);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export interface ProgressoClassificacao {
  feitas: number;
  total: number;
  esperando: number;
}

/** Classifies (once, cached in the DB) the topic of each question that has none yet. */
export async function classificarPendentes(
  questoes: SimuladoQuestao[],
  onProgresso: (p: ProgressoClassificacao) => void,
  cancelado: () => boolean = () => false,
) {
  const { data } = await supabase
    .from("enade_questao_topicos")
    .select("key")
    .in("key", questoes.map((q) => q.key));
  const prontas = new Set((data ?? []).map((d: { key: string }) => d.key));
  const pendentes = questoes.filter((q) => !q.anulada && !prontas.has(q.key));

  let feitas = 0;
  onProgresso({ feitas, total: pendentes.length, esperando: 0 });
  for (const q of pendentes) {
    if (cancelado()) break;
    const imagens = await Promise.all(
      q.imgs.slice(0, 3).map((img) => imagemReduzida(`/enade-img/${q.examId}/${img}`)),
    );
    await comRetentativa(
      () => chamarSimulado("classificar", { key: q.key, area: q.area, ans: q.ans, imagens }),
      (s) => onProgresso({ feitas, total: pendentes.length, esperando: s }),
      15,
    );
    feitas++;
    onProgresso({ feitas, total: pendentes.length, esperando: 0 });
  }
  return { feitas, total: pendentes.length };
}

export interface ParticipanteEntrada {
  email: string;
  nome: string | null;
  matricula: string | null;
}

/** Parses pasted text (one person per line, e.g. copied from a spreadsheet): email, optional name and matrícula. */
export function lerParticipantes(texto: string) {
  const validos = new Map<string, ParticipanteEntrada>();
  const invalidas: string[] = [];
  for (const linha of texto.split(/\r?\n/)) {
    if (!linha.trim()) continue;
    const emailOriginal = linha.match(/[^\s,;<>"']+@[^\s,;<>"']+\.[^\s,;<>"']+/)?.[0];
    if (!emailOriginal) {
      invalidas.push(linha.trim());
      continue;
    }
    const email = emailOriginal.toLowerCase();
    const resto = linha.replace(emailOriginal, " ");
    const matricula = resto.match(/\b[0-9][0-9A-Za-z.\-/]{4,}\b/)?.[0] ?? null;
    const nome = (matricula ? resto.replace(matricula, " ") : resto)
      .replace(/[\t,;|<>"]+/g, " ").replace(/\s+/g, " ").trim() || null;
    validos.set(email, { email, nome, matricula });
  }
  return { participantes: [...validos.values()], invalidas };
}

export function linkDoSimulado(id: string) {
  return `${window.location.origin}/simulado/${id}`;
}
