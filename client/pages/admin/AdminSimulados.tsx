import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, ClipboardList, Copy, Eye, Loader2, Lock, Plus, Trash2, Unlock, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/simulado/StatusBadge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ENADE_DATA } from "@/lib/enadeData";
import type { EnadeExam } from "@/lib/enadeTypes";
import {
  classificarPendentes, lerParticipantes, linkDoSimulado, type ProgressoClassificacao,
} from "@/lib/simuladoApi";
import type { SimuladoQuestao } from "@shared/simulado";

const PROVAS = ENADE_DATA as EnadeExam[];

interface Linha {
  id: string;
  titulo: string;
  status: "aberto" | "fechado";
  created_at: string;
  questoes: SimuladoQuestao[];
  simulado_participantes: { count: number }[];
  simulado_respostas: { count: number }[];
}

export default function AdminSimulados() {
  const navigate = useNavigate();
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [criando, setCriando] = useState(false);
  const [excluir, setExcluir] = useState<Linha | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("simulados")
      .select("id, titulo, status, created_at, questoes, simulado_participantes(count), simulado_respostas(count)")
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar simulados: " + error.message);
    setLinhas((data as Linha[]) ?? []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alternarStatus = async (l: Linha) => {
    const status = l.status === "aberto" ? "fechado" : "aberto";
    const { error } = await supabase.from("simulados").update({ status }).eq("id", l.id);
    if (error) return toast.error(error.message);
    toast.success(status === "aberto" ? "Simulado reaberto" : "Simulado encerrado");
    carregar();
  };

  const confirmarExclusao = async () => {
    if (!excluir) return;
    const { error } = await supabase.from("simulados").delete().eq("id", excluir.id);
    setExcluir(null);
    if (error) return toast.error(error.message);
    toast.success("Simulado excluído");
    carregar();
  };

  const copiar = (id: string) => {
    navigator.clipboard.writeText(linkDoSimulado(id));
    toast.success("Link copiado");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Simulados ENADE</h1>
          <p className="text-muted-foreground mt-1">
            Monte um simulado, convide os alunos e acompanhe ranking, tópicos e análise da IA.
          </p>
        </div>
        {!criando && (
          <Button onClick={() => setCriando(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo simulado
          </Button>
        )}
      </div>

      {criando && (
        <CriarSimulado
          onCancelar={() => setCriando(false)}
          onCriado={(id) => navigate(`/admin/simulados/${id}`)}
        />
      )}

      {carregando ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : linhas.length === 0 && !criando ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Nenhum simulado ainda</p>
            <p className="text-sm text-muted-foreground">Clique em "Novo simulado" para criar o primeiro.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {linhas.map((l) => {
            const convidados = l.simulado_participantes[0]?.count ?? 0;
            const respostas = l.simulado_respostas[0]?.count ?? 0;
            return (
              <Card key={l.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
                  <button className="flex-1 min-w-0 text-left" onClick={() => navigate(`/admin/simulados/${l.id}`)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{l.titulo}</h3>
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {respostas}/{convidados} responderam
                      </span>
                      <span>{l.questoes.filter((q) => !q.anulada).length} questões</span>
                      <span>criado em {new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => copiar(l.id)} title="Copiar link para os alunos">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => alternarStatus(l)}
                      title={l.status === "aberto" ? "Encerrar" : "Reabrir"}
                    >
                      {l.status === "aberto" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/simulados/${l.id}`)} title="Resultados">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setExcluir(l)} title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir "{excluir?.titulo}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Participantes, respostas e análises deste simulado serão apagados. Não dá para desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function snapshot(exam: EnadeExam, idx: number): SimuladoQuestao {
  const q = exam.questions[idx];
  return {
    key: `${exam.id}:${idx}`,
    examId: exam.id,
    idx,
    n: q.n,
    curso: exam.curso,
    ano: exam.ano,
    area: q.area,
    imgs: q.imgs,
    ans: q.ans,
    anulada: q.anulada,
  };
}

type Passo = "questoes" | "participantes" | "salvando" | "classificando";

function CriarSimulado({ onCancelar, onCriado }: { onCancelar: () => void; onCriado: (id: string) => void }) {
  const [passo, setPasso] = useState<Passo>("questoes");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [provaId, setProvaId] = useState("");
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [textoParticipantes, setTextoParticipantes] = useState("");
  const [progresso, setProgresso] = useState<ProgressoClassificacao | null>(null);
  const [criadoId, setCriadoId] = useState<string | null>(null);
  const pularRef = useRef(false);

  const prova = PROVAS.find((p) => p.id === provaId);
  const anos = useMemo(() => [...new Set(PROVAS.map((p) => p.ano))].sort((a, b) => b - a), []);

  const questoesSelecionadas = useMemo(
    () =>
      PROVAS.flatMap((exam) =>
        exam.questions.flatMap((_, i) => (selecionadas.has(`${exam.id}:${i}`) ? [snapshot(exam, i)] : [])),
      ),
    [selecionadas],
  );
  const porProva = useMemo(() => {
    const m = new Map<string, number>();
    questoesSelecionadas.forEach((q) => m.set(q.examId, (m.get(q.examId) ?? 0) + 1));
    return [...m.entries()].map(([id, n]) => ({ exam: PROVAS.find((p) => p.id === id)!, n }));
  }, [questoesSelecionadas]);

  const { participantes, invalidas } = useMemo(() => lerParticipantes(textoParticipantes), [textoParticipantes]);

  const alternar = (key: string) =>
    setSelecionadas((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return s;
    });

  const selecionarDaProva = (filtro: (area: string) => boolean) => {
    if (!prova) return;
    setSelecionadas((prev) => {
      const s = new Set([...prev].filter((k) => !k.startsWith(`${prova.id}:`)));
      prova.questions.forEach((q, i) => {
        if (!q.anulada && filtro(q.area)) s.add(`${prova.id}:${i}`);
      });
      return s;
    });
  };

  const removerProva = (examId: string) =>
    setSelecionadas((prev) => new Set([...prev].filter((k) => !k.startsWith(`${examId}:`))));

  const salvar = async () => {
    setPasso("salvando");
    const { data, error } = await supabase
      .from("simulados")
      .insert({ titulo: titulo.trim(), descricao: descricao.trim() || null, questoes: questoesSelecionadas })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Erro ao criar simulado: " + (error?.message ?? ""));
      setPasso("participantes");
      return;
    }
    const { error: errPart } = await supabase
      .from("simulado_participantes")
      .insert(participantes.map((p) => ({ ...p, simulado_id: data.id })));
    if (errPart) toast.error("Simulado criado, mas houve erro ao salvar participantes: " + errPart.message);

    setCriadoId(data.id);
    setPasso("classificando");
    try {
      await classificarPendentes(questoesSelecionadas, setProgresso, () => pularRef.current);
      toast.success("Simulado criado");
    } catch (e) {
      toast.warning("Simulado criado. A classificação de tópicos pode ser retomada na página do simulado.", {
        description: (e as Error).message,
      });
    }
    if (!pularRef.current) onCriado(data.id);
  };

  const continuarDepois = () => {
    pularRef.current = true;
    if (criadoId) onCriado(criadoId);
  };

  const validasSelecionadas = questoesSelecionadas.filter((q) => !q.anulada).length;

  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          Novo simulado · {passo === "questoes" ? "1. Questões" : passo === "participantes" ? "2. Participantes" : "Criando"}
        </CardTitle>
        {(passo === "questoes" || passo === "participantes") && (
          <Button variant="ghost" size="icon" onClick={onCancelar} aria-label="Cancelar">
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {passo === "questoes" && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Ex.: Simulado ENADE 2026.2 — TASI"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Instruções para os alunos (opcional)</label>
                <Input
                  placeholder="Ex.: Prazo até 30/11. Faça sem consulta."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Escolha uma prova para adicionar questões</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={provaId}
                onChange={(e) => setProvaId(e.target.value)}
              >
                <option value="">Selecione…</option>
                {anos.map((ano) => (
                  <optgroup key={ano} label={`ENADE ${ano}`}>
                    {PROVAS.filter((p) => p.ano === ano).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.curso} ({p.questions.length} questões)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Pode misturar questões de várias provas: troque a prova acima e continue marcando.
              </p>
            </div>

            {prova && (
              <div className="rounded-lg border p-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => selecionarDaProva(() => true)}>
                    Prova inteira
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => selecionarDaProva((a) => a !== "Formação Geral")}>
                    Só conhecimento específico
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => selecionarDaProva((a) => a === "Formação Geral")}>
                    Só formação geral
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removerProva(prova.id)}>
                    Limpar desta prova
                  </Button>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
                  {prova.questions.map((q, i) => {
                    const key = `${prova.id}:${i}`;
                    const sel = selecionadas.has(key);
                    return (
                      <button
                        key={key}
                        disabled={q.anulada}
                        onClick={() => alternar(key)}
                        title={`Q${q.n} · ${q.area}${q.anulada ? " · anulada" : ""}`}
                        className={cn(
                          "h-8 rounded text-xs font-bold border transition-colors",
                          q.anulada
                            ? "opacity-40 line-through cursor-not-allowed"
                            : sel
                              ? "bg-primary text-primary-foreground border-primary"
                              : q.area === "Formação Geral"
                                ? "bg-amber-50 border-amber-200 hover:border-primary/50"
                                : "bg-white border-border hover:border-primary/50",
                        )}
                      >
                        {q.n}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Amarelo = formação geral · riscadas = anuladas pelo INEP
                </p>
              </div>
            )}

            {porProva.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {porProva.map(({ exam, n }) => (
                  <span key={exam.id} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full pl-3 pr-1 py-1">
                    {exam.curso} {exam.ano}: {n}
                    <button onClick={() => removerProva(exam.id)} aria-label={`Remover ${exam.curso} ${exam.ano}`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t pt-4">
              <span className="text-sm text-muted-foreground">{validasSelecionadas} questões selecionadas</span>
              <Button
                disabled={!titulo.trim() || validasSelecionadas === 0}
                onClick={() => setPasso("participantes")}
              >
                Próximo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {passo === "participantes" && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Alunos convidados</label>
              <Textarea
                className="min-h-[160px] font-mono text-xs"
                placeholder={"Cole da planilha — um aluno por linha:\nmaria.souza@faeterj-rio.edu.br  Maria Souza  20231234567\njoao.lima@faeterj-rio.edu.br"}
                value={textoParticipantes}
                onChange={(e) => setTextoParticipantes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Em cada linha: email (obrigatório), nome e matrícula (opcionais). Se informar a matrícula, o aluno
                precisa digitá-la para entrar.
              </p>
            </div>

            {participantes.length > 0 && (
              <div className="rounded-lg border max-h-56 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.map((p) => (
                      <tr key={p.email} className="border-t">
                        <td className="p-2 font-mono">{p.email}</td>
                        <td className="p-2">{p.nome ?? "—"}</td>
                        <td className="p-2 font-mono">{p.matricula ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {invalidas.length > 0 && (
              <p className="text-xs text-destructive">
                {invalidas.length} linha(s) sem email válido serão ignoradas: {invalidas.slice(0, 3).join(" · ")}
                {invalidas.length > 3 ? "…" : ""}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setPasso("questoes")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {validasSelecionadas} questões · {participantes.length} alunos
                </span>
                <Button disabled={participantes.length === 0} onClick={salvar}>
                  <Plus className="w-4 h-4 mr-1" /> Criar simulado
                </Button>
              </div>
            </div>
          </>
        )}

        {passo === "salvando" && (
          <div className="py-8 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Criando simulado…</p>
          </div>
        )}

        {passo === "classificando" && (
          <div className="py-4 space-y-3">
            <p className="text-sm font-medium">Identificando o tópico de cada questão com IA</p>
            <Progress value={progresso && progresso.total ? (progresso.feitas / progresso.total) * 100 : 0} />
            <p className="text-xs text-muted-foreground">
              {progresso ? `${progresso.feitas} de ${progresso.total} questões novas` : "Verificando questões…"}
              {progresso?.esperando ? ` · aguardando limite gratuito da IA (${progresso.esperando}s)` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Cada questão só é classificada uma vez e fica salva para os próximos simulados. O simulado já está
              criado; se preferir, siga em frente e retome depois na página de resultados.
            </p>
            <Button variant="outline" size="sm" onClick={continuarDepois}>
              Continuar depois
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
