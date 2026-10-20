import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ENADE_DATA } from "@/lib/enadeData";
import type {
  EnadeExam,
  EnadeQuestionWithExam,
  ExamStats,
  ViewMode,
  GeralFilter,
} from "@/lib/enadeTypes";

const LS_KEY = "enade_answers_v1";
const LS_ORDER = "enade_order_v1";

function load<T>(key: string, dflt: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : dflt;
  } catch {
    return dflt;
  }
}

function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

function shuffled<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useEnadeQuiz() {
  const exams: EnadeExam[] = ENADE_DATA;

  const byId = useMemo(
    () => Object.fromEntries(exams.map((e) => [e.id, e])) as Record<string, EnadeExam>,
    [exams],
  );

  const allQuestions = useMemo<EnadeQuestionWithExam[]>(
    () =>
      exams.flatMap((e) =>
        e.questions.map((q) => ({ ...q, exam: e.id, ano: e.ano, curso: e.curso })),
      ),
    [exams],
  );

  const anos = useMemo(() => [...new Set(exams.map((e) => e.ano))].sort(), [exams]);
  const cursos = useMemo(() => [...new Set(exams.map((e) => e.curso))].sort(), [exams]);
  const areas = useMemo(() => [...new Set(allQuestions.map((q) => q.area))], [allQuestions]);

  const [answers, setAnswers] = useState<Record<string, string>>(() => load(LS_KEY, {}));
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [geralFilter, setGeralFilter] = useState<GeralFilter>({
    ano: "",
    curso: "",
    area: "",
    status: "",
    shuffle: false,
  });
  const [geralList, setGeralList] = useState<EnadeQuestionWithExam[]>([]);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const qKey = useCallback(
    (q: EnadeQuestionWithExam) => `${q.exam}:${q.n}`,
    [],
  );

  const isAnswered = useCallback(
    (q: EnadeQuestionWithExam) => answersRef.current[qKey(q)] !== undefined,
    [qKey],
  );

  const isRight = useCallback(
    (q: EnadeQuestionWithExam) => {
      if (q.anulada) return null;
      return answersRef.current[qKey(q)] === q.ans;
    },
    [qKey],
  );

  const getExamStats = useCallback(
    (e: EnadeExam): ExamStats => {
      let ok = 0,
        bad = 0,
        tot = 0;
      for (const q of e.questions) {
        if (q.anulada) continue;
        tot++;
        const a = answers[`${e.id}:${q.n}`];
        if (a === undefined) continue;
        if (a === q.ans) ok++;
        else bad++;
      }
      return { ok, bad, tot, done: ok + bad };
    },
    [answers],
  );

  const globalStats = useMemo(() => {
    const g = { ok: 0, bad: 0, tot: 0, done: 0 };
    exams.forEach((e) => {
      const s = getExamStats(e);
      g.ok += s.ok;
      g.bad += s.bad;
      g.tot += s.tot;
      g.done += s.done;
    });
    return g;
  }, [exams, getExamStats]);

  const buildGeralList = useCallback(
    (filter: GeralFilter): EnadeQuestionWithExam[] => {
      let list = allQuestions.filter(
        (q) =>
          (!filter.ano || String(q.ano) === filter.ano) &&
          (!filter.curso || q.curso === filter.curso) &&
          (!filter.area || q.area === filter.area) &&
          (filter.status !== "nao" || answersRef.current[qKey(q)] === undefined) &&
          (filter.status !== "erradas" ||
            (answersRef.current[qKey(q)] !== undefined &&
              !q.anulada &&
              answersRef.current[qKey(q)] !== q.ans)),
      );
      if (filter.shuffle) {
        let st = load<{ seed: number } | null>(LS_ORDER, null);
        if (!st || !st.seed) {
          st = { seed: Math.floor(Math.random() * 1e9) };
          save(LS_ORDER, st);
        }
        list = shuffled(list, st.seed);
      }
      return list;
    },
    [allQuestions, qKey],
  );

  const questionsFor = useMemo<EnadeQuestionWithExam[]>(() => {
    if (viewMode === "exam" && currentExamId && byId[currentExamId]) {
      const e = byId[currentExamId];
      return e.questions.map((q) => ({
        ...q,
        exam: e.id,
        ano: e.ano,
        curso: e.curso,
      }));
    }
    if (viewMode === "geral") return geralList;
    return [];
  }, [viewMode, currentExamId, byId, geralList]);

  const currentQuestion = useMemo(() => {
    if (questionsFor.length === 0) return null;
    return questionsFor[Math.min(idx, questionsFor.length - 1)];
  }, [questionsFor, idx]);

  const quizScores = useMemo(() => {
    let ok = 0,
      bad = 0,
      resp = 0;
    questionsFor.forEach((x) => {
      if (!x.anulada && answers[qKey(x)] !== undefined) {
        resp++;
        if (answers[qKey(x)] === x.ans) ok++;
        else bad++;
      }
    });
    return { ok, bad, resp, total: questionsFor.length };
  }, [questionsFor, answers, qKey]);

  const goHome = useCallback(() => {
    setViewMode("home");
    setCurrentExamId(null);
    setIdx(0);
    setSelected(null);
  }, []);

  const openExam = useCallback(
    (id: string) => {
      if (!byId[id]) return;
      setViewMode("exam");
      setCurrentExamId(id);
      const list = byId[id].questions.map((q) => ({
        ...q,
        exam: id,
        ano: byId[id].ano,
        curso: byId[id].curso,
      }));
      const firstUnanswered = list.findIndex(
        (q) => answersRef.current[`${id}:${q.n}`] === undefined,
      );
      setIdx(Math.max(0, firstUnanswered));
      setSelected(null);
    },
    [byId],
  );

  const openGeral = useCallback(() => {
    const filter: GeralFilter = {
      ano: "",
      curso: "",
      area: "",
      status: "",
      shuffle: false,
    };
    setGeralFilter(filter);
    const list = buildGeralList(filter);
    setGeralList(list);
    setViewMode("geral");
    setIdx(0);
    setSelected(null);
  }, [buildGeralList]);

  const updateGeralFilter = useCallback(
    (partial: Partial<GeralFilter>) => {
      setGeralFilter((prev) => {
        const next = { ...prev, ...partial };
        const list = buildGeralList(next);
        setGeralList(list);
        setIdx(0);
        setSelected(null);
        return next;
      });
    },
    [buildGeralList],
  );

  const reshuffle = useCallback(() => {
    save(LS_ORDER, { seed: Math.floor(Math.random() * 1e9) });
    setGeralFilter((prev) => {
      const list = buildGeralList(prev);
      setGeralList(list);
      setIdx(0);
      setSelected(null);
      return prev;
    });
  }, [buildGeralList]);

  const persistAnswers = useCallback((next: Record<string, string>) => {
    setAnswers(next);
    save(LS_KEY, next);
  }, []);

  const confirmAnswer = useCallback(() => {
    if (!selected || !currentQuestion || currentQuestion.anulada) return;
    const k = qKey(currentQuestion);
    const next = { ...answersRef.current, [k]: selected };
    persistAnswers(next);
    setSelected(null);
  }, [selected, currentQuestion, qKey, persistAnswers]);

  const redo = useCallback(() => {
    if (!currentQuestion) return;
    const k = qKey(currentQuestion);
    const next = { ...answersRef.current };
    delete next[k];
    persistAnswers(next);
    setSelected(null);
  }, [currentQuestion, qKey, persistAnswers]);

  const clearExam = useCallback(() => {
    if (!currentExamId || !byId[currentExamId]) return;
    const next = { ...answersRef.current };
    byId[currentExamId].questions.forEach((q) => {
      delete next[`${currentExamId}:${q.n}`];
    });
    persistAnswers(next);
    setSelected(null);
  }, [currentExamId, byId, persistAnswers]);

  const resetAllAnswers = useCallback(() => {
    persistAnswers({});
  }, [persistAnswers]);

  const navigate = useCallback(
    (direction: "prev" | "next" | number) => {
      setSelected(null);
      if (typeof direction === "number") {
        setIdx(direction);
      } else if (direction === "prev") {
        setIdx((i) => Math.max(0, i - 1));
      } else {
        setIdx((i) => Math.min(questionsFor.length - 1, i + 1));
      }
    },
    [questionsFor.length],
  );

  const selectAnswer = useCallback(
    (letter: string) => {
      if (!currentQuestion) return;
      if (answers[qKey(currentQuestion)] !== undefined) return;
      if (currentQuestion.anulada) return;
      setSelected(letter);
    },
    [currentQuestion, answers, qKey],
  );

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (viewMode === "home") return;
      const tag = (ev.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      const L = ev.key.toUpperCase();
      if (["A", "B", "C", "D", "E"].includes(L)) {
        selectAnswer(L);
      } else if (ev.key === "Enter") {
        confirmAnswer();
      } else if (ev.key === "ArrowLeft") {
        navigate("prev");
      } else if (ev.key === "ArrowRight") {
        navigate("next");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [viewMode, selectAnswer, confirmAnswer, navigate]);

  return {
    exams,
    byId,
    allQuestions,
    anos,
    cursos,
    areas,

    answers,
    viewMode,
    currentExamId,
    idx,
    selected,
    geralFilter,
    questionsFor,
    currentQuestion,
    quizScores,
    globalStats,

    qKey,
    isAnswered,
    isRight,
    getExamStats,

    goHome,
    openExam,
    openGeral,
    updateGeralFilter,
    reshuffle,
    confirmAnswer,
    redo,
    clearExam,
    resetAllAnswers,
    navigate,
    selectAnswer,
  };
}
