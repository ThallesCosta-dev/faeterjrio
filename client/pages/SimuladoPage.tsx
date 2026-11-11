import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Brain, CheckCircle2, ClipboardList, Loader2, Lock, Send, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BarraTopico } from "@/components/simulado/BarraTopico";
import { cn } from "@/lib/utils";
import { markdownParaHtml } from "@/lib/markdown";
import { SimuladoErro, chamarSimulado, comRetentativa } from "@/lib/simuladoApi";
import { ALTERNATIVAS, formatarPct, type ResultadoAluno, type SimuladoQuestaoPublica } from "@shared/simulado";

interface Info {
  titulo: string;
  descricao: string | null;
  status: "aberto" | "fechado";
  total_questoes: number;
}

type EntrarResposta =
  | { estado: "liberado"; nome: string | null; questoes: SimuladoQuestaoPublica[] }
  | { estado: "respondido"; nome: string | null; resultado: ResultadoAluno }
  | { estado: "fechado"; nome: string | null };

type Etapa = "carregando" | "erro" | "identificar" | "prova" | "enviando" | "resultado" | "fechado";

const chaveRascunho = (id: string, email: string) => `simulado:${id}:${email}`;

function lerRascunho(id: string, email: string): { respostas: Record<string, string>; idx: number } | null {
  try {
    const bruto = localStorage.getItem(chaveRascunho(id, email));
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function salvarRascunho(id: string, email: string, respostas: Record<string, string>, idx: number) {
  try {
    localStorage.setItem(chaveRascunho(id, email), JSON.stringify({ respostas, idx }));
  } catch {
    // storage unavailable (private mode); answers still live in memory
  }
}

function limparRascunho(id: string, email: string) {
  try {
    localStorage.removeItem(chaveRascunho(id, email));
  } catch {
    // ignore
  }
}

export default function SimuladoPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [erro, setErro] = useState("");
  const [info, setInfo] = useState<Info | null>(null);

  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState<string | null>(null);
  const [erroIdent, setErroIdent] = useState<{ campo: "email" | "matricula" | "geral"; msg: string } | null>(null);
  const [entrando, setEntrando] = useState(false);

  const [questoes, setQuestoes] = useState<SimuladoQuestaoPublica[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  const [resultado, setResultado] = useState<ResultadoAluno | null>(null);

  useEffect(() => {
    chamarSimulado<Info>("info", { simulado_id: id })
      .then((i) => {
        setInfo(i);
        setEtapa("identificar");
      })
      .catch((e: SimuladoErro) => {
        setErro(e.message);
        setEtapa("erro");
      });
  }, [id]);

  const emailNorm = email.trim().toLowerCase();

  const entrar = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      setErroIdent({ campo: "email", msg: "Informe seu email institucional." });
      return;
    }
    setErroIdent(null);
    setEntrando(true);
    try {
      const r = await chamarSimulado<EntrarResposta>("entrar", { simulado_id: id, email: emailNorm, matricula });
      setNome(r.nome);
      if (r.estado === "respondido") {
        setResultado(r.resultado);
        setEtapa("resultado");
      } else if (r.estado === "fechado") {
        setEtapa("fechado");
      } else {
        const rascunho = lerRascunho(id, emailNorm);
        setQuestoes(r.questoes);
        setRespostas(rascunho?.respostas ?? {});
        setIdx(Math.min(rascunho?.idx ?? 0, r.questoes.length - 1));
        setEtapa("prova");
      }
    } catch (e) {
      const err = e as SimuladoErro;
      const campo =
        err.codigo === "matricula_invalida"
          ? "matricula"
          : err.codigo === "nao_convidado" || err.codigo === "email_invalido"
            ? "email"
            : "geral";
      setErroIdent({ campo, msg: err.message });
    } finally {
      setEntrando(false);
    }
  };

  const atual = questoes[idx];
  const validas = useMemo(() => questoes.filter((q) => !q.anulada), [questoes]);
  const respondidas = validas.filter((q) => respostas[q.key]).length;
  const emBranco = validas.length - respondidas;

  const marcar = useCallback(
    (letra: string | null) => {
      if (!atual || atual.anulada) return;
      setRespostas((prev) => {
        const novo = { ...prev };
        if (letra === null || prev[atual.key] === letra) delete novo[atual.key];
        else novo[atual.key] = letra;
        return novo;
      });
    },
    [atual],
  );

  useEffect(() => {
    if (etapa === "prova") salvarRascunho(id, emailNorm, respostas, idx);
  }, [etapa, id, emailNorm, respostas, idx]);

  useEffect(() => {
    if (etapa !== "prova") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || confirmarEnvio) return;
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      const k = e.key.toUpperCase();
      if ((ALTERNATIVAS as readonly string[]).includes(k)) marcar(k);
      else if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, questoes.length - 1));
      else if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [etapa, marcar, questoes.length, confirmarEnvio]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document
      .querySelector('nav[aria-label="Questões"] [aria-current="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [idx, etapa]);

  const enviar = async () => {
    setConfirmarEnvio(false);
    setEtapa("enviando");
    try {
      const r = await chamarSimulado<{ resultado: ResultadoAluno }>("enviar", {
        simulado_id: id, email: emailNorm, matricula, respostas,
      });
      limparRascunho(id, emailNorm);
      setResultado(r.resultado);
      setEtapa("resultado");
    } catch (e) {
      const err = e as SimuladoErro;
      if (err.codigo === "fechado") {
        setEtapa("fechado");
        return;
      }
      setErro(err.message);
      setEtapa("prova");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Início">
            <img src="/logo_faeterj.svg" alt="" className="w-7 h-7" style={{ filter: "invert(1)" }} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-white/60 leading-none">Simulado ENADE</p>
            <p className="text-sm font-semibold truncate">{info?.titulo ?? "Carregando…"}</p>
          </div>
          {etapa === "prova" && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-white/80 hidden sm:inline">
                {respondidas}/{validas.length} respondidas
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => (emBranco > 0 ? setConfirmarEnvio(true) : enviar())}
              >
                <Send className="w-4 h-4 mr-1" /> Finalizar
              </Button>
            </div>
          )}
        </div>
        {etapa === "prova" && (
          <div className="h-1 bg-white/15">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${validas.length ? (respondidas / validas.length) * 100 : 0}%` }}
            />
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        {etapa === "carregando" && <Centro><Loader2 className="w-8 h-8 animate-spin text-primary" /></Centro>}

        {etapa === "erro" && (
          <Centro>
            <AlertTriangle className="w-10 h-10 text-amber-500" />
            <p className="font-semibold text-lg">{erro || "Não foi possível abrir o simulado."}</p>
            <Link to="/" className="text-primary underline text-sm">Voltar ao início</Link>
          </Centro>
        )}

        {etapa === "fechado" && (
          <Centro>
            <Lock className="w-10 h-10 text-muted-foreground" />
            <p className="font-semibold text-lg">Este simulado está encerrado.</p>
            <p className="text-sm text-muted-foreground">Fale com a coordenação se acha que isso é um engano.</p>
          </Centro>
        )}

        {etapa === "enviando" && (
          <Centro>
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Enviando e corrigindo suas respostas…</p>
          </Centro>
        )}

        {etapa === "identificar" && info && (
          <Card className="max-w-md mx-auto mt-6">
            <CardHeader className="text-center space-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ClipboardList className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">{info.titulo}</CardTitle>
              {info.descricao && <p className="text-sm text-muted-foreground whitespace-pre-line">{info.descricao}</p>}
              <p className="text-xs text-muted-foreground">
                {info.total_questoes} questões · resposta única por aluno
              </p>
            </CardHeader>
            <CardContent>
              {info.status === "fechado" && (
                <p className="text-xs text-center bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2 mb-4">
                  Simulado encerrado. Entre para consultar seu resultado.
                </p>
              )}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  entrar();
                }}
              >
                <div className="space-y-1.5">
                  <label htmlFor="sim-email" className="text-sm font-medium">Email institucional</label>
                  <Input
                    id="sim-email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu.nome@faeterj-rio.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={erroIdent?.campo === "email"}
                  />
                  {erroIdent?.campo === "email" && <p className="text-sm text-destructive">{erroIdent.msg}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="sim-matricula" className="text-sm font-medium">Matrícula</label>
                  <Input
                    id="sim-matricula"
                    inputMode="numeric"
                    placeholder="Sua matrícula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    aria-invalid={erroIdent?.campo === "matricula"}
                  />
                  {erroIdent?.campo === "matricula" && <p className="text-sm text-destructive">{erroIdent.msg}</p>}
                </div>
                {erroIdent?.campo === "geral" && <p className="text-sm text-destructive">{erroIdent.msg}</p>}
                <Button type="submit" className="w-full" disabled={entrando}>
                  {entrando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {info.status === "fechado" ? "Ver meu resultado" : "Entrar no simulado"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {etapa === "prova" && atual && (
          <div className="space-y-4">
            {nome && <p className="text-sm text-muted-foreground">Olá, <strong>{nome.split(" ")[0]}</strong>. Suas respostas ficam salvas neste navegador até você finalizar.</p>}
            {erro && (
              <p className="text-sm bg-destructive/10 text-destructive rounded-md p-3">{erro}</p>
            )}

            <nav
              className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible"
              aria-label="Questões"
            >
              {questoes.map((q, i) => (
                <button
                  key={q.key}
                  onClick={() => setIdx(i)}
                  aria-current={i === idx}
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-md text-xs font-bold border transition-colors",
                    i === idx
                      ? "bg-primary text-primary-foreground border-primary"
                      : q.anulada
                        ? "bg-muted text-muted-foreground border-dashed"
                        : respostas[q.key]
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-white text-foreground/60 border-border hover:border-primary/40",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </nav>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <CardTitle className="text-base">Questão {idx + 1} de {questoes.length}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    ENADE {atual.ano} · {atual.curso} · Q{atual.n}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {atual.anulada && (
                  <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2">
                    Questão anulada pelo INEP — não conta na nota.
                  </p>
                )}
                {atual.imgs.map((img) => (
                  <img
                    key={img}
                    src={`/enade-img/${atual.examId}/${img}`}
                    alt={`Enunciado da questão ${atual.n}`}
                    className="w-full rounded-md border bg-white"
                  />
                ))}

                {!atual.anulada && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Sua resposta <span className="hidden sm:inline">(teclas A–E; ← → para navegar)</span>
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {ALTERNATIVAS.map((letra) => {
                        const sel = respostas[atual.key] === letra;
                        return (
                          <button
                            key={letra}
                            onClick={() => marcar(letra)}
                            aria-pressed={sel}
                            className={cn(
                              "h-12 rounded-lg border-2 text-lg font-bold transition-colors",
                              sel
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-white border-border hover:border-primary/50 hover:bg-primary/5",
                            )}
                          >
                            {letra}
                          </button>
                        );
                      })}
                    </div>
                    {respostas[atual.key] && (
                      <button onClick={() => marcar(null)} className="text-xs text-muted-foreground underline mt-2">
                        Limpar resposta
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" onClick={() => setIdx(idx - 1)} disabled={idx === 0}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              {idx < questoes.length - 1 ? (
                <Button onClick={() => setIdx(idx + 1)}>
                  Próxima <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={() => (emBranco > 0 ? setConfirmarEnvio(true) : enviar())}>
                  <Send className="w-4 h-4 mr-1" /> Finalizar simulado
                </Button>
              )}
            </div>
          </div>
        )}

        {etapa === "resultado" && resultado && (
          <Resultado
            resultado={resultado}
            nome={nome}
            pedirFeedback={() =>
              chamarSimulado<{ feedback: string }>("feedback", { simulado_id: id, email: emailNorm, matricula })
            }
            onFeedback={(f) => setResultado({ ...resultado, ai_feedback: f })}
          />
        )}
      </main>

      <AlertDialog open={confirmarEnvio} onOpenChange={setConfirmarEnvio}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar com questões em branco?</AlertDialogTitle>
            <AlertDialogDescription>
              Você deixou {emBranco} {emBranco === 1 ? "questão" : "questões"} sem resposta. Elas contam como erro e
              não será possível alterar depois do envio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e revisar</AlertDialogCancel>
            <AlertDialogAction onClick={enviar}>Enviar mesmo assim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center gap-3 text-center py-24">{children}</div>;
}

function Resultado({
  resultado,
  nome,
  pedirFeedback,
  onFeedback,
}: {
  resultado: ResultadoAluno;
  nome: string | null;
  pedirFeedback: () => Promise<{ feedback: string }>;
  onFeedback: (f: string) => void;
}) {
  const [gerando, setGerando] = useState(false);
  const [espera, setEspera] = useState(0);
  const [erro, setErro] = useState("");

  const gerar = async () => {
    setGerando(true);
    setErro("");
    try {
      const r = await comRetentativa(pedirFeedback, setEspera);
      onFeedback(r.feedback);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setGerando(false);
      setEspera(0);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-10 h-10 mx-auto text-green-600 mb-2" />
            <h1 className="text-xl font-bold">
              {nome ? `${nome.split(" ")[0]}, seu simulado foi registrado` : "Simulado registrado"}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Numero valor={`${resultado.acertos}`} rotulo="acertos" />
            <Numero valor={`${resultado.total}`} rotulo="questões válidas" />
            <Numero
              valor={formatarPct(resultado.nota)}
              rotulo="aproveitamento"
              cor={resultado.nota >= 60 ? "text-green-600" : resultado.nota >= 40 ? "text-amber-600" : "text-red-600"}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Desempenho por tópico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resultado.por_topico.map((t) => (
            <BarraTopico key={t.topico} rotulo={t.topico} acertos={t.acertos} total={t.total} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Feedback personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resultado.ai_feedback ? (
            <div
              className="prose prose-sm max-w-none prose-headings:text-primary prose-h2:text-base"
              dangerouslySetInnerHTML={{ __html: markdownParaHtml(resultado.ai_feedback) }}
            />
          ) : (
            <div className="text-center space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                A IA analisa seus erros por tópico e sugere um plano de estudo para o ENADE.
              </p>
              <Button onClick={gerar} disabled={gerando}>
                {gerando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                {espera > 0 ? `IA ocupada, tentando de novo em ${espera}s…` : gerando ? "Gerando…" : "Gerar meu feedback"}
              </Button>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {resultado.erradas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Questões que você errou ({resultado.erradas.length})</CardTitle>
            {resultado.erradas.some((e) => e.explicacao) && (
              <p className="text-xs text-muted-foreground">
                Explicações baseadas no gabarito oficial; parte delas é gerada por IA — na dúvida, confirme com o professor.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {resultado.erradas.map((e) => (
                <li key={e.key} className="py-2.5 flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      Q{e.n} · ENADE {e.ano} {e.curso}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.topico}
                      {e.subtopico ? ` · ${e.subtopico}` : ""}
                    </p>
                    {e.explicacao && (
                      <p className="text-xs mt-1.5 text-foreground/80 bg-muted/60 rounded p-2 whitespace-pre-line">
                        <span className="font-semibold">Por que {e.correta}:</span> {e.explicacao}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-right shrink-0">
                    você: <strong>{e.marcada ?? "—"}</strong>
                    <br />
                    gabarito: <strong className="text-green-700">{e.correta}</strong>
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="text-center">
        <Link to="/enade" className="text-sm text-primary underline">Continuar praticando no Simulado Enade</Link>
      </p>
    </div>
  );
}

function Numero({ valor, rotulo, cor }: { valor: string; rotulo: string; cor?: string }) {
  return (
    <div>
      <p className={cn("text-3xl font-bold tabular-nums", cor ?? "text-primary")}>{valor}</p>
      <p className="text-xs text-muted-foreground">{rotulo}</p>
    </div>
  );
}
