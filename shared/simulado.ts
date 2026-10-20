export const TOPICOS_ENADE = [
  "Formação Geral",
  "Algoritmos e Programação",
  "Estruturas de Dados",
  "Banco de Dados",
  "Engenharia de Software",
  "Redes de Computadores",
  "Sistemas Operacionais",
  "Arquitetura de Computadores",
  "Segurança da Informação",
  "Matemática e Lógica",
  "Teoria da Computação",
  "Gestão e Governança de TI",
  "Interação Humano-Computador e Web",
  "Inteligência Artificial e Dados",
  "Outros",
] as const;

export const ALTERNATIVAS = ["A", "B", "C", "D", "E"] as const;

/** Snapshot of an ENADE question frozen when the simulado is created. */
export interface SimuladoQuestao {
  key: string; // "examId:idx"
  examId: string;
  idx: number;
  n: number;
  curso: string;
  ano: number;
  area: string;
  imgs: string[];
  ans: string | null;
  anulada: boolean;
}

export type SimuladoQuestaoPublica = Omit<SimuladoQuestao, "ans">;

export interface Simulado {
  id: string;
  titulo: string;
  descricao: string | null;
  questoes: SimuladoQuestao[];
  status: "aberto" | "fechado";
  ai_analise: string | null;
  ai_analise_em: string | null;
  created_at: string;
}

export interface SimuladoParticipante {
  id: string;
  simulado_id: string;
  email: string;
  nome: string | null;
  matricula: string | null;
  created_at: string;
}

export interface SimuladoResposta {
  id: string;
  simulado_id: string;
  email: string;
  respostas: Record<string, string>;
  acertos: number;
  total: number;
  nota: number;
  submitted_at: string;
  ai_feedback: string | null;
}

export interface QuestaoTopico {
  key: string;
  topico: string;
  subtopico: string | null;
  resumo: string | null;
  explicacao: string | null;
}

export interface DesempenhoTopico {
  topico: string;
  acertos: number;
  total: number;
}

export interface QuestaoErrada {
  key: string;
  n: number;
  curso: string;
  ano: number;
  topico: string;
  subtopico: string | null;
  resumo: string | null;
  explicacao: string | null;
  marcada: string | null;
  correta: string;
}

export interface ResultadoAluno {
  acertos: number;
  total: number;
  nota: number;
  por_topico: DesempenhoTopico[];
  erradas: QuestaoErrada[];
  ai_feedback: string | null;
}

export function topicoDe(
  q: Pick<SimuladoQuestao, "key" | "area">,
  topicos: Record<string, QuestaoTopico>,
): string {
  return topicos[q.key]?.topico ?? (q.area === "Formação Geral" ? "Formação Geral" : q.area || "Outros");
}

/** Mirrored in supabase/functions/simulado/index.ts — keep both in sync. */
export function corrigir(
  questoes: SimuladoQuestao[],
  respostas: Record<string, string>,
  topicos: Record<string, QuestaoTopico>,
): Omit<ResultadoAluno, "ai_feedback"> {
  let acertos = 0;
  let total = 0;
  const porTopico = new Map<string, DesempenhoTopico>();
  const erradas: QuestaoErrada[] = [];

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
        key: q.key,
        n: q.n,
        curso: q.curso,
        ano: q.ano,
        topico,
        subtopico: topicos[q.key]?.subtopico ?? null,
        resumo: topicos[q.key]?.resumo ?? null,
        explicacao: topicos[q.key]?.explicacao ?? null,
        marcada,
        correta: q.ans,
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
