export interface EnadeQuestion {
  n: number;
  ans: string | null;
  anulada: boolean;
  imgs: string[];
  area: string;
}

export interface EnadeExam {
  id: string;
  ano: number;
  curso: string;
  questions: EnadeQuestion[];
}

export interface EnadeQuestionWithExam extends EnadeQuestion {
  exam: string;
  ano: number;
  curso: string;
}

export interface ExamStats {
  ok: number;
  bad: number;
  tot: number;
  done: number;
}

export type ViewMode = "home" | "exam" | "geral";

export interface GeralFilter {
  ano: string;
  curso: string;
  area: string;
  status: string;
  shuffle: boolean;
}
