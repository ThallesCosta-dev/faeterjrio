import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Brain, ChevronDown, ChevronRight, Copy, Download, Loader2, Lock, RotateCcw, Sparkles,
  Trash2, Trophy, Unlock, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BarraTopico } from "@/components/simulado/BarraTopico";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { markdownParaHtml } from "@/lib/markdown";
import {
  SimuladoErro, chamarSimulado, classificarPendentes, comRetentativa, lerParticipantes, linkDoSimulado,
  type ProgressoClassificacao,
} from "@/lib/simuladoApi";
import {
  corrigir, formatarPct, topicoDe, type QuestaoTopico, type Simulado, type SimuladoParticipante, type SimuladoResposta,
} from "@shared/simulado";
import { StatusBadge } from "@/components/simulado/StatusBadge";

const pct = (a: number, t: number) => (t > 0 ? Math.round((a / t) * 100) : 0);

export default function AdminSimuladoDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [respostas, setRespostas] = useState<SimuladoResposta[]>([]);
  const [participantes, setParticipantes] = useState<SimuladoParticipante[]>([]);
  const [topicos, setTopicos] = useState<Record<string, QuestaoTopico>>({});
  const [progresso, setProgresso] = useState<ProgressoClassificacao | null>(null);

  const carregarTopicos = useCallback(async (keys: string[]) => {
    const { data } = await supabase
      .from("enade_questao_topicos")
      .select("key, topico, subtopico, resumo, explicacao")
      .in("key", keys);
    setTopicos(Object.fromEntries(((data ?? []) as QuestaoTopico[]).map((t) => [t.key, t])));
  }, []);

  const carregar = useCallback(async () => {
    const [sim, resp, part] = await Promise.all([
      supabase.from("simulados").select("*").eq("id", id).maybeSingle(),
      supabase.from("simulado_respostas").select("*").eq("simulado_id", id),
      supabase.from("simulado_participantes").select("*").eq("simulado_id", id).order("nome"),
    ]);
    const s = sim.data as Simulado | null;
    setSimulado(s);
    setRespostas((resp.data as SimuladoResposta[]) ?? []);
    setParticipantes((part.data as SimuladoParticipante[]) ?? []);
    if (s) await carregarTopicos(s.questoes.map((q) => q.key));
    setCarregando(false);
  }, [id, carregarTopicos]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const participantePorEmail = useMemo(
    () => Object.fromEntries(participantes.map((p) => [p.email, p])),
    [participantes],
  );

  const ranking = useMemo(() => {
    if (!simulado) return [];
    return respostas
      .map((r) => ({ r, p: participantePorEmail[r.email], c: corrigir(simulado.questoes, r.respostas, topicos) }))
      .sort((a, b) => Number(b.r.nota) - Number(a.r.nota) || a.r.submitted_at.localeCompare(b.r.submitted_at));
  }, [simulado, respostas, topicos, participantePorEmail]);

  const questoesValidas = useMemo(
    () => (simulado?.questoes ?? []).filter((q) => !q.anulada && q.ans),
    [simulado],
  );
  const pendentesClassificacao = questoesValidas.filter((q) => !topicos[q.key]).length;

  const turmaPorTopico = useMemo(() => {
    const m = new Map<string, { acertos: number; total: number; questoes: number }>();
    for (const q of questoesValidas) {
      const t = m.get(topicoDe(q, topicos)) ?? { acertos: 0, total: 0, questoes: 0 };
      t.questoes++;
      for (const r of respostas) {
        t.total++;
        if (r.respostas[q.key] === q.ans) t.acertos++;
      }
      m.set(topicoDe(q, topicos), t);
    }
    return [...m.entries()]
      .map(([topico, v]) => ({ topico, ...v }))
      .sort((a, b) => a.acertos / (a.total || 1) - b.acertos / (b.total || 1));
  }, [questoesValidas, respostas, topicos]);

  const porQuestao = useMemo(
    () =>
      questoesValidas
        .map((q) => {
          const marcas: Record<string, number> = {};
          let acertos = 0;
          for (const r of respostas) {
            const m = r.respostas[q.key] ?? "branco";
            if (m === q.ans) acertos++;
            else marcas[m] = (marcas[m] ?? 0) + 1;
          }
          const distrator = Object.entries(marcas).sort((a, b) => b[1] - a[1])[0];
          return { q, acertos, taxa: pct(acertos, respostas.length), distrator };
        })
        .sort((a, b) => a.taxa - b.taxa),
    [questoesValidas, respostas],
  );

  const estatisticas = useMemo(() => {
    if (!respostas.length) return null;
    const notas = respostas.map((r) => Number(r.nota)).sort((a, b) => a - b);
    return {
      media: notas.reduce((a, b) => a + b, 0) / notas.length,
      mediana: notas[Math.floor(notas.length / 2)],
      min: notas[0],
      max: notas[notas.length - 1],
    };
  }, [respostas]);

  const classificar = async () => {
    if (!simulado) return;
    try {
      await classificarPendentes(simulado.questoes, setProgresso);
      toast.success("Tópicos classificados");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProgresso(null);
      carregarTopicos(simulado.questoes.map((q) => q.key));
    }
  };

  const alternarStatus = async () => {
    if (!simulado) return;
    const status = simulado.status === "aberto" ? "fechado" : "aberto";
    const { error } = await supabase.from("simulados").update({ status }).eq("id", simulado.id);
    if (error) return toast.error(error.message);
    setSimulado({ ...simulado, status });
    toast.success(status === "aberto" ? "Simulado reaberto" : "Simulado encerrado");
  };

  const exportarCsv = () => {
    if (!simulado) return;
    const nomesTopicos = turmaPorTopico.map((t) => t.topico);
    const cel = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const linhas = [
      ["Posição", "Nome", "Matrícula", "Email", "Acertos", "Total", "Nota (%)", "Enviado em", ...nomesTopicos.map((t) => `${t} (%)`)],
      ...ranking.map(({ r, p, c }, i) => [
        i + 1, p?.nome, p?.matricula, r.email, r.acertos, r.total, Number(r.nota).toFixed(1).replace(".", ","),
        new Date(r.submitted_at).toLocaleString("pt-BR"),
        ...nomesTopicos.map((t) => {
          const x = c.por_topico.find((pt) => pt.topico === t);
          return x ? pct(x.acertos, x.total) : "";
        }),
      ]),
    ];
    const csv = "﻿" + linhas.map((l) => l.map(cel).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `${simulado.titulo.replace(/[^\w\- ]+/g, "").trim() || "simulado"} - ranking.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (carregando) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!simulado) return <p className="text-center text-muted-foreground py-12">Simulado não encontrado.</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/simulados")} aria-label="Voltar">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold truncate">{simulado.titulo}</h1>
            <StatusBadge status={simulado.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {questoesValidas.length} questões · {respostas.length} de {participantes.length} alunos responderam
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(linkDoSimulado(simulado.id));
              toast.success("Link copiado");
            }}
          >
            <Copy className="w-4 h-4 mr-1" /> Link para alunos
          </Button>
          <Button size="sm" variant="outline" onClick={alternarStatus}>
            {simulado.status === "aberto" ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
            {simulado.status === "aberto" ? "Encerrar" : "Reabrir"}
          </Button>
          <Button size="sm" variant="outline" onClick={exportarCsv} disabled={!ranking.length}>
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      {pendentesClassificacao > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-3 space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-amber-900">
                {pendentesClassificacao} questão(ões) ainda sem tópico — aparecem como "{simulado.questoes.find((q) => !topicos[q.key])?.area}" nos relatórios.
              </p>
              {!progresso && (
                <Button size="sm" onClick={classificar}>
                  <Sparkles className="w-4 h-4 mr-1" /> Classificar com IA
                </Button>
              )}
            </div>
            {progresso && (
              <>
                <Progress value={progresso.total ? (progresso.feitas / progresso.total) * 100 : 0} />
                <p className="text-xs text-amber-900">
                  {progresso.feitas} de {progresso.total}
                  {progresso.esperando ? ` · aguardando limite gratuito da IA (${progresso.esperando}s)` : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="ranking">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="topicos">Tópicos e questões</TabsTrigger>
          <TabsTrigger value="participantes">Participantes ({participantes.length})</TabsTrigger>
          <TabsTrigger value="ia">Análise da IA</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-4">
          {estatisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Estatistica rotulo="Média" valor={estatisticas.media} />
              <Estatistica rotulo="Mediana" valor={estatisticas.mediana} />
              <Estatistica rotulo="Maior nota" valor={estatisticas.max} />
              <Estatistica rotulo="Menor nota" valor={estatisticas.min} />
            </div>
          )}
          <Ranking ranking={ranking} onReset={carregar} />
        </TabsContent>

        <TabsContent value="topicos" className="space-y-4">
          {!respostas.length ? (
            <Vazio texto="Os gráficos aparecem quando os primeiros alunos responderem." />
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Acerto da turma por tópico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {turmaPorTopico.map((t) => (
                    <BarraTopico
                      key={t.topico}
                      rotulo={t.topico}
                      acertos={t.acertos}
                      total={t.total}
                      detalhe={`${t.questoes} ${t.questoes === 1 ? "questão" : "questões"}`}
                    />
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Questões, da mais difícil para a mais fácil</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-2">Questão</th>
                        <th className="py-2 pr-2">Tópico</th>
                        <th className="py-2 pr-2 text-center">Gabarito</th>
                        <th className="py-2 pr-2 text-center">Acerto</th>
                        <th className="py-2">Erro mais comum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porQuestao.map(({ q, taxa, distrator }) => (
                        <tr key={q.key} className="border-b last:border-0 align-top">
                          <td className="py-2 pr-2 whitespace-nowrap">
                            <a
                              href={`/enade-img/${q.examId}/${q.imgs[0]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Q{q.n}
                            </a>
                            <span className="text-xs text-muted-foreground"> · {q.curso} {q.ano}</span>
                          </td>
                          <td className="py-2 pr-2">
                            <p>{topicoDe(q, topicos)}{topicos[q.key]?.subtopico ? ` · ${topicos[q.key]!.subtopico}` : ""}</p>
                            {topicos[q.key]?.resumo && <p className="text-xs text-muted-foreground">{topicos[q.key]!.resumo}</p>}
                            {topicos[q.key]?.explicacao && (
                              <details className="text-xs text-muted-foreground mt-1">
                                <summary className="cursor-pointer text-primary">Por que {q.ans}?</summary>
                                <p className="mt-1 whitespace-pre-line">{topicos[q.key]!.explicacao}</p>
                              </details>
                            )}
                          </td>
                          <td className="py-2 pr-2 text-center font-bold">{q.ans}</td>
                          <td className={cn("py-2 pr-2 text-center font-bold tabular-nums", taxa >= 60 ? "text-green-600" : taxa >= 40 ? "text-amber-600" : "text-red-600")}>
                            {taxa}%
                          </td>
                          <td className="py-2 text-xs text-muted-foreground">
                            {distrator ? `${distrator[0] === "branco" ? "em branco" : distrator[0]} (${distrator[1]} aluno${distrator[1] > 1 ? "s" : ""})` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="participantes">
          <Participantes
            simuladoId={simulado.id}
            participantes={participantes}
            respondeu={new Map(respostas.map((r) => [r.email, Number(r.nota)]))}
            onAlterado={carregar}
          />
        </TabsContent>

        <TabsContent value="ia">
          <AnaliseIA
            simulado={simulado}
            temRespostas={respostas.length > 0}
            onGerada={(analise, em) => setSimulado({ ...simulado, ai_analise: analise, ai_analise_em: em })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Estatistica({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-2xl font-bold tabular-nums">{formatarPct(valor)}</p>
        <p className="text-xs text-muted-foreground">{rotulo}</p>
      </CardContent>
    </Card>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-sm text-muted-foreground">{texto}</CardContent>
    </Card>
  );
}

function Ranking({
  ranking,
  onReset,
}: {
  ranking: {
    r: SimuladoResposta;
    p: SimuladoParticipante | undefined;
    c: ReturnType<typeof corrigir>;
  }[];
  onReset: () => void;
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [resetar, setResetar] = useState<SimuladoResposta | null>(null);

  const confirmarReset = async () => {
    if (!resetar) return;
    const { error } = await supabase.from("simulado_respostas").delete().eq("id", resetar.id);
    setResetar(null);
    if (error) return toast.error(error.message);
    toast.success("Tentativa liberada — o aluno pode refazer o simulado");
    onReset();
  };

  if (!ranking.length) return <Vazio texto="Ninguém respondeu ainda. Compartilhe o link com os alunos." />;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Ranking
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2 w-10">#</th>
              <th className="py-2">Aluno</th>
              <th className="py-2 text-center">Acertos</th>
              <th className="py-2 text-center">Nota</th>
              <th className="py-2 hidden md:table-cell">Pior tópico</th>
              <th className="py-2 text-right hidden sm:table-cell">Enviado</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(({ r, p, c }, i) => {
              const expandido = aberto === r.id;
              const pior = c.por_topico[0];
              return (
                <Fragment key={r.id}>
                  <tr
                    className={cn("border-b cursor-pointer hover:bg-muted/40", expandido && "bg-muted/40")}
                    onClick={() => setAberto(expandido ? null : r.id)}
                  >
                    <td className="py-2 font-bold text-muted-foreground tabular-nums">{i + 1}º</td>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        {expandido ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p?.nome ?? r.email}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {p?.nome ? r.email : ""}
                            {p?.matricula ? ` · ${p.matricula}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-center tabular-nums">{r.acertos}/{r.total}</td>
                    <td className={cn("py-2 text-center font-bold tabular-nums", Number(r.nota) >= 60 ? "text-green-600" : Number(r.nota) >= 40 ? "text-amber-600" : "text-red-600")}>
                      {formatarPct(r.nota)}
                    </td>
                    <td className="py-2 text-xs hidden md:table-cell">
                      {pior ? `${pior.topico} (${pct(pior.acertos, pior.total)}%)` : "—"}
                    </td>
                    <td className="py-2 text-right text-xs text-muted-foreground hidden sm:table-cell">
                      {new Date(r.submitted_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                  {expandido && (
                    <tr className="border-b bg-muted/20">
                      <td colSpan={6} className="p-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Desempenho por tópico</p>
                            {c.por_topico.map((t) => (
                              <BarraTopico key={t.topico} rotulo={t.topico} acertos={t.acertos} total={t.total} />
                            ))}
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Feedback da IA para o aluno</p>
                            {r.ai_feedback ? (
                              <div
                                className="prose prose-sm max-w-none max-h-80 overflow-auto rounded-md border bg-white p-3"
                                dangerouslySetInnerHTML={{ __html: markdownParaHtml(r.ai_feedback) }}
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground">O aluno ainda não gerou o feedback.</p>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResetar(r);
                              }}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" /> Liberar nova tentativa
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </CardContent>

      <AlertDialog open={!!resetar} onOpenChange={(o) => !o && setResetar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liberar nova tentativa?</AlertDialogTitle>
            <AlertDialogDescription>
              A resposta de {resetar?.email} (nota {formatarPct(resetar?.nota ?? 0)}) e o feedback dela serão
              apagados, e o aluno poderá fazer o simulado de novo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarReset} className="bg-destructive hover:bg-destructive/90">
              Apagar e liberar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function Participantes({
  simuladoId,
  participantes,
  respondeu,
  onAlterado,
}: {
  simuladoId: string;
  participantes: SimuladoParticipante[];
  respondeu: Map<string, number>;
  onAlterado: () => void;
}) {
  const [texto, setTexto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const { participantes: novos, invalidas } = useMemo(() => lerParticipantes(texto), [texto]);
  const pendentes = participantes.filter((p) => !respondeu.has(p.email));

  const adicionar = async () => {
    setSalvando(true);
    const existentes = new Set(participantes.map((p) => p.email));
    const inserir = novos.filter((p) => !existentes.has(p.email));
    const atualizar = novos.filter((p) => existentes.has(p.email) && (p.nome || p.matricula));
    const erros: string[] = [];
    if (inserir.length) {
      const { error } = await supabase
        .from("simulado_participantes")
        .insert(inserir.map((p) => ({ ...p, simulado_id: simuladoId })));
      if (error) erros.push(error.message);
    }
    for (const p of atualizar) {
      const campos = Object.fromEntries(Object.entries({ nome: p.nome, matricula: p.matricula }).filter(([, v]) => v));
      const { error } = await supabase
        .from("simulado_participantes")
        .update(campos)
        .eq("simulado_id", simuladoId)
        .eq("email", p.email);
      if (error) erros.push(error.message);
    }
    setSalvando(false);
    if (erros.length) return toast.error(erros[0]);
    toast.success(`${inserir.length} adicionado(s), ${atualizar.length} atualizado(s)`);
    setTexto("");
    onAlterado();
  };

  const remover = async (p: SimuladoParticipante) => {
    const { error } = await supabase.from("simulado_participantes").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    onAlterado();
  };

  const copiarPendentes = () => {
    navigator.clipboard.writeText(pendentes.map((p) => p.email).join("; "));
    toast.success(`${pendentes.length} emails copiados`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            {participantes.length - pendentes.length} responderam · {pendentes.length} pendentes
          </CardTitle>
          {pendentes.length > 0 && (
            <Button size="sm" variant="outline" onClick={copiarPendentes}>
              <Copy className="w-4 h-4 mr-1" /> Emails pendentes
            </Button>
          )}
        </CardHeader>
        <CardContent className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2">Aluno</th>
                <th className="py-2">Matrícula</th>
                <th className="py-2">Situação</th>
                <th className="py-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {participantes.map((p) => {
                const nota = respondeu.get(p.email);
                return (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2">
                      <p className="font-medium">{p.nome ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </td>
                    <td className="py-2 font-mono text-xs">{p.matricula ?? "—"}</td>
                    <td className="py-2 text-xs">
                      {nota !== undefined ? (
                        <span className="text-green-700 font-medium">Respondeu · {formatarPct(nota)}</span>
                      ) : (
                        <span className="text-muted-foreground">Pendente</span>
                      )}
                    </td>
                    <td className="py-2">
                      {nota === undefined && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remover(p)} title="Remover">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Adicionar ou atualizar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            className="min-h-[140px] font-mono text-xs"
            placeholder={"email  nome  matrícula\n(um por linha, colado da planilha)"}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          {invalidas.length > 0 && (
            <p className="text-xs text-destructive">{invalidas.length} linha(s) sem email válido serão ignoradas.</p>
          )}
          <Button className="w-full" disabled={!novos.length || salvando} onClick={adicionar}>
            {salvando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar {novos.length || ""} participante(s)
          </Button>
          <p className="text-xs text-muted-foreground">Emails já cadastrados têm nome e matrícula atualizados.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AnaliseIA({
  simulado,
  temRespostas,
  onGerada,
}: {
  simulado: Simulado;
  temRespostas: boolean;
  onGerada: (analise: string, em: string) => void;
}) {
  const [gerando, setGerando] = useState(false);
  const [espera, setEspera] = useState(0);

  const gerar = async () => {
    setGerando(true);
    try {
      const r = await comRetentativa(
        () =>
          chamarSimulado<{ analise: string; gerada_em: string }>("analise", {
            simulado_id: simulado.id,
            forcar: !!simulado.ai_analise,
          }),
        setEspera,
      );
      onGerada(r.analise, r.gerada_em);
    } catch (e) {
      toast.error(e instanceof SimuladoErro ? e.message : "Erro ao gerar análise");
    } finally {
      setGerando(false);
      setEspera(0);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 gap-3 flex-wrap">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Onde a turma foi bem e onde foi mal
          </CardTitle>
          {simulado.ai_analise_em && (
            <p className="text-xs text-muted-foreground mt-1">
              Gerada em {new Date(simulado.ai_analise_em).toLocaleString("pt-BR")}. Atualize após novas respostas.
            </p>
          )}
        </div>
        <Button size="sm" onClick={gerar} disabled={gerando || !temRespostas}>
          {gerando ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
          {espera > 0 ? `IA ocupada, nova tentativa em ${espera}s` : simulado.ai_analise ? "Atualizar análise" : "Gerar análise"}
        </Button>
      </CardHeader>
      <CardContent>
        {simulado.ai_analise ? (
          <div
            className="prose prose-sm max-w-none prose-headings:text-primary prose-h2:text-base"
            dangerouslySetInnerHTML={{ __html: markdownParaHtml(simulado.ai_analise) }}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">
            {temRespostas
              ? "A IA cruza o acerto por tópico, as questões mais erradas e as alternativas erradas mais marcadas para sugerir ações à coordenação."
              : "Disponível depois que os alunos responderem."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
