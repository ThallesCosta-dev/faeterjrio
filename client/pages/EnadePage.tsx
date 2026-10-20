import "./enade.css";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type {
  EnadeExam,
  EnadeQuestion,
  EnadeQuestionWithExam,
  ExamStats,
  GeralFilter,
} from "@/lib/enadeTypes";
import { ENADE_DATA } from "@/lib/enadeData";

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

const NET_SVG = (
  <svg
    viewBox="0 0 1000 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="w-full h-full"
  >
    <circle cx="150" cy="100" r="8" fill="white" opacity=".6" />
    <circle cx="300" cy="180" r="6" fill="white" opacity=".5" />
    <circle cx="450" cy="120" r="7" fill="white" opacity=".6" />
    <circle cx="600" cy="200" r="5" fill="white" opacity=".4" />
    <circle cx="750" cy="150" r="8" fill="white" opacity=".6" />
    <circle cx="900" cy="220" r="6" fill="white" opacity=".5" />
    <line x1="150" y1="100" x2="300" y2="180" stroke="white" opacity=".4" />
    <line x1="300" y1="180" x2="450" y2="120" stroke="white" opacity=".4" />
    <line x1="450" y1="120" x2="600" y2="200" stroke="white" opacity=".4" />
    <line x1="600" y1="200" x2="750" y2="150" stroke="white" opacity=".4" />
    <line x1="750" y1="150" x2="900" y2="220" stroke="white" opacity=".4" />
    <text
      x="200"
      y="350"
      fontSize="12"
      fill="white"
      opacity=".3"
      fontFamily="monospace"
    >
      {"const enade = faeterj.estudar();"}
    </text>
    <text
      x="650"
      y="450"
      fontSize="12"
      fill="white"
      opacity=".3"
      fontFamily="monospace"
    >
      {"{ aprovado: true }"}
    </text>
    <rect
      x="50"
      y="400"
      width="60"
      height="60"
      fill="none"
      stroke="white"
      strokeWidth="2"
      opacity=".3"
      transform="rotate(45 80 430)"
    />
    <circle cx="850" cy="350" r="40" fill="none" stroke="white" opacity=".3" />
  </svg>
);

type ViewMode = "home" | "exam" | "geral";

export default function EnadePage() {
  const exams = ENADE_DATA as EnadeExam[];

  const { byId, allQ, anos, cursos, areas } = useMemo(() => {
    const byId = Object.fromEntries(exams.map((e) => [e.id, e]));
    const allQ: EnadeQuestionWithExam[] = exams.flatMap((e) =>
      e.questions.map((q) => ({ ...q, exam: e.id, ano: e.ano, curso: e.curso }))
    );
    const anos = [...new Set(exams.map((e) => e.ano))].sort();
    const cursos = [...new Set(exams.map((e) => e.curso))].sort();
    const areas = [...new Set(allQ.map((q) => q.area))];
    return { byId, allQ, anos, cursos, areas };
  }, [exams]);

  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    load(LS_KEY, {})
  );
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [currentExamId, setCurrentExamId] = useState<string>("");
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

  const saveAnswers = useCallback((newAnswers: Record<string, string>) => {
    setAnswers(newAnswers);
    save(LS_KEY, newAnswers);
  }, []);

  const qKey = (q: { exam: string; n: number }) => `${q.exam}:${q.n}`;
  const isAnswered = useCallback(
    (q: { exam: string; n: number }) => answersRef.current[qKey(q)] !== undefined,
    []
  );
  const isRight = useCallback(
    (q: EnadeQuestionWithExam) =>
      q.anulada ? null : answersRef.current[qKey(q)] === q.ans,
    []
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
    [answers]
  );

  const questionsFor = useMemo((): EnadeQuestionWithExam[] => {
    if (viewMode === "exam" && byId[currentExamId]) {
      return byId[currentExamId].questions.map((q) => ({
        ...q,
        exam: currentExamId,
        ano: byId[currentExamId].ano,
        curso: byId[currentExamId].curso,
      }));
    }
    if (viewMode === "geral") return geralList;
    return [];
  }, [viewMode, currentExamId, byId, geralList]);

  const rebuildGeral = useCallback(
    (filter: GeralFilter, keepPos = false) => {
      let list = allQ.filter(
        (q) =>
          (!filter.ano || String(q.ano) === filter.ano) &&
          (!filter.curso || q.curso === filter.curso) &&
          (!filter.area || q.area === filter.area) &&
          (filter.status !== "nao" || !isAnswered(q)) &&
          (filter.status !== "erradas" ||
            (isAnswered(q) && isRight(q) === false))
      );
      if (filter.shuffle) {
        let st = load<{ seed: number } | null>(LS_ORDER, null);
        if (!st || !st.seed) {
          st = { seed: Math.floor(Math.random() * 1e9) };
          save(LS_ORDER, st);
        }
        list = shuffled(list, st.seed);
      }
      setGeralList(list);
      if (!keepPos) setIdx(0);
    },
    [allQ, isAnswered, isRight]
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

  const goHome = useCallback(() => {
    setViewMode("home");
    setSelected(null);
    window.scrollTo({ top: 0 });
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
      const first = list.findIndex((q) => !isAnswered(q));
      setIdx(Math.max(0, first === -1 ? 0 : first));
      setSelected(null);
      window.scrollTo({ top: 0 });
    },
    [byId, isAnswered]
  );

  const openGeral = useCallback(() => {
    setViewMode("geral");
    rebuildGeral(geralFilter, true);
    window.scrollTo({ top: 0 });
  }, [geralFilter, rebuildGeral]);

  const confirmAnswer = useCallback(() => {
    if (!selected) return;
    const list = questionsFor;
    const q = list[idx];
    if (!q || q.anulada) return;
    const newAnswers = { ...answersRef.current, [qKey(q)]: selected };
    saveAnswers(newAnswers);
    setSelected(null);
  }, [selected, questionsFor, idx, saveAnswers]);

  const redoQuestion = useCallback(() => {
    const list = questionsFor;
    const q = list[idx];
    if (!q) return;
    const newAnswers = { ...answersRef.current };
    delete newAnswers[qKey(q)];
    saveAnswers(newAnswers);
    setSelected(null);
  }, [questionsFor, idx, saveAnswers]);

  const clearExamAnswers = useCallback(() => {
    if (!currentExamId || !byId[currentExamId]) return;
    if (!confirm("Limpar todas as respostas desta prova?")) return;
    const newAnswers = { ...answersRef.current };
    byId[currentExamId].questions.forEach(
      (q) => delete newAnswers[`${currentExamId}:${q.n}`]
    );
    saveAnswers(newAnswers);
    setSelected(null);
  }, [currentExamId, byId, saveAnswers]);

  const resetAll = useCallback(() => {
    if (!confirm("Apagar TODAS as respostas salvas?")) return;
    saveAnswers({});
  }, [saveAnswers]);

  // Keyboard
  useEffect(() => {
    if (viewMode === "home") return;
    const handler = (ev: KeyboardEvent) => {
      if (
        ev.target &&
        /^(INPUT|SELECT|TEXTAREA)$/.test(
          (ev.target as HTMLElement).tagName
        )
      )
        return;
      const L = ev.key.toUpperCase();
      if (["A", "B", "C", "D", "E"].includes(L)) {
        const q = questionsFor[idx];
        if (q && !answersRef.current[qKey(q)] && !q.anulada) {
          setSelected(L);
        }
      } else if (ev.key === "Enter") {
        confirmAnswer();
      } else if (ev.key === "ArrowLeft" && idx > 0) {
        setIdx((i) => i - 1);
        setSelected(null);
      } else if (ev.key === "ArrowRight" && idx < questionsFor.length - 1) {
        setIdx((i) => i + 1);
        setSelected(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [viewMode, idx, questionsFor, confirmAnswer]);

  // HOME VIEW
  if (viewMode === "home") {
    const pct = globalStats.done
      ? Math.round((100 * globalStats.ok) / globalStats.done)
      : 0;
    return (
      <div className="enade-page">
        {/* Hero */}
        <section className="enade-hero">
          <div className="enade-net">{NET_SVG}</div>
          <div className="enade-glow enade-glow-a" />
          <div className="enade-glow enade-glow-b" />
          <div className="container mx-auto px-4 relative" style={{ paddingTop: 80, paddingBottom: 96 }}>
            <span className="enade-eyebrow">ENADE · Área de Computação</span>
            <h1 className="enade-hero-title">
              Banco de Questões ENADE da FAETERJ-Rio
            </h1>
            <p className="enade-hero-lead">
              {allQ.length} questões objetivas de {exams.length} provas oficiais
              ({anos[0]}–{anos[anos.length - 1]}), com gabarito do INEP. Estude
              prova por prova ou misture tudo no modo geral. Seu progresso fica
              salvo neste navegador.
            </p>
            <div className="enade-cta">
              <button className="enade-btn enade-btn-white" onClick={openGeral}>
                Modo geral — todas as questões
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <button
                className="enade-btn enade-btn-white-outline"
                onClick={() => {
                  document
                    .getElementById("enade-provas")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Escolher uma prova
              </button>
            </div>
            <div className="enade-statrow">
              <div className="enade-stat">
                <b>{globalStats.done}</b>
                <span>respondidas</span>
              </div>
              <div className="enade-stat">
                <b className="enade-stat-ok">{globalStats.ok}</b>
                <span>acertos</span>
              </div>
              <div className="enade-stat">
                <b className="enade-stat-bad">{globalStats.bad}</b>
                <span>erros</span>
              </div>
              <div className="enade-stat">
                <b>{globalStats.done ? pct + "%" : "—"}</b>
                <span>aproveitamento</span>
              </div>
            </div>
          </div>
        </section>

        {/* Provas */}
        <section
          className="enade-section container mx-auto px-4"
          id="enade-provas"
        >
          <div className="enade-section-head">
            <div>
              <span className="enade-kicker">Provas oficiais</span>
              <h2>Escolha uma prova</h2>
              <p>
                Cada cartão mostra seu progresso e aproveitamento. Clique para
                começar ou continuar.
              </p>
            </div>
            <button className="enade-btn enade-btn-small" onClick={resetAll}>
              Zerar progresso
            </button>
          </div>

          {[...anos].reverse().map((ano) => (
            <div key={ano}>
              <h3 className="enade-year">ENADE {ano}</h3>
              <div className="enade-grid">
                {exams
                  .filter((e) => e.ano === ano)
                  .map((e) => {
                    const s = getExamStats(e);
                    const okW = s.tot ? (100 * s.ok) / s.tot : 0;
                    const badW = s.tot ? (100 * s.bad) / s.tot : 0;
                    const complete = s.tot > 0 && s.done === s.tot;
                    return (
                      <button
                        key={e.id}
                        className="enade-card"
                        onClick={() => openExam(e.id)}
                      >
                        <div className="enade-tagrow">
                          <span className="enade-tag">{ano}</span>
                          {complete && (
                            <span className="enade-tag enade-tag-done">
                              Concluída
                            </span>
                          )}
                        </div>
                        <div className="enade-card-title">{e.curso}</div>
                        <div className="enade-card-meta">
                          {e.questions.length} questões objetivas
                        </div>
                        <div className="enade-pbar">
                          <div
                            className="enade-pbar-ok"
                            style={{ width: `${okW}%` }}
                          />
                          <div
                            className="enade-pbar-bad"
                            style={{ width: `${badW}%` }}
                          />
                        </div>
                        <div className="enade-cardstats">
                          <span>
                            {s.done}/{s.tot} respondidas
                          </span>
                          <span>
                            {s.done
                              ? Math.round((100 * s.ok) / s.done) +
                                "% de acerto"
                              : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

          <p className="enade-note">
            Teclas: <kbd>A</kbd>–<kbd>E</kbd> seleciona · <kbd>Enter</kbd>{" "}
            responde · <kbd>←</kbd>
            <kbd>→</kbd> navega. Progresso salvo automaticamente neste
            navegador.
          </p>
        </section>
      </div>
    );
  }

  // QUIZ VIEW (exam or geral)
  const list = questionsFor;
  const safeIdx = Math.min(idx, Math.max(0, list.length - 1));
  const q = list[safeIdx];
  const isGeral = viewMode === "geral";
  const a = q ? answers[qKey(q)] : undefined;
  const done = a !== undefined;

  let listOk = 0,
    listBad = 0,
    listResp = 0;
  list.forEach((x) => {
    if (!x.anulada && answers[qKey(x)] !== undefined) {
      listResp++;
      if (!x.anulada && answers[qKey(x)] === x.ans) listOk++;
      else listBad++;
    }
  });

  return (
    <div className="enade-page">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="enade-navrow" style={{ marginTop: 90 }}>
          <button className="enade-btn enade-btn-small" onClick={goHome}>
            ← Início
          </button>
          <span className="text-sm" style={{ color: "var(--enade-muted-fg)" }}>
            {isGeral
              ? "Modo geral — todas as provas"
              : `ENADE ${byId[currentExamId]?.ano} · ${byId[currentExamId]?.curso}`}
          </span>
        </div>

        {/* Filters (geral only) */}
        {isGeral && (
          <div className="enade-filters">
            <select
              value={geralFilter.ano}
              onChange={(e) => {
                const f = { ...geralFilter, ano: e.target.value };
                setGeralFilter(f);
                rebuildGeral(f);
              }}
            >
              <option value="">Todos os anos</option>
              {anos.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select
              value={geralFilter.curso}
              onChange={(e) => {
                const f = { ...geralFilter, curso: e.target.value };
                setGeralFilter(f);
                rebuildGeral(f);
              }}
            >
              <option value="">Todos os cursos</option>
              {cursos.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={geralFilter.area}
              onChange={(e) => {
                const f = { ...geralFilter, area: e.target.value };
                setGeralFilter(f);
                rebuildGeral(f);
              }}
            >
              <option value="">Todas as áreas</option>
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select
              value={geralFilter.status}
              onChange={(e) => {
                const f = { ...geralFilter, status: e.target.value };
                setGeralFilter(f);
                rebuildGeral(f);
              }}
            >
              <option value="">Todas</option>
              <option value="nao">Não respondidas</option>
              <option value="erradas">Que errei</option>
            </select>
            <label className="enade-ck">
              <input
                type="checkbox"
                checked={geralFilter.shuffle}
                onChange={(e) => {
                  const f = { ...geralFilter, shuffle: e.target.checked };
                  setGeralFilter(f);
                  rebuildGeral(f);
                }}
              />
              Embaralhar
            </label>
            <button
              className="enade-btn enade-btn-small"
              disabled={!geralFilter.shuffle}
              onClick={() => {
                save(LS_ORDER, {
                  seed: Math.floor(Math.random() * 1e9),
                });
                rebuildGeral(geralFilter);
              }}
            >
              Reembaralhar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!list.length && (
          <div className="enade-empty">
            Nenhuma questão com esses filtros.
          </div>
        )}

        {/* Question */}
        {q && (
          <>
            <div className="enade-quizhead">
              <span className="enade-where">
                {isGeral
                  ? `ENADE ${q.ano} · ${q.curso}`
                  : `Questão ${safeIdx + 1} de ${list.length}`}
              </span>
              <span className="enade-area">{q.area}</span>
              <span className="enade-score">
                <span className="enade-score-ok">✔ {listOk}</span>
                <span className="enade-score-bad">✘ {listBad}</span>
                <span className="enade-score-tot">
                  {listResp}/{list.length}
                </span>
              </span>
            </div>

            <div className="enade-qcard">
              <div className="enade-qtop">
                <span className="enade-qnum">
                  {isGeral
                    ? `Questão ${safeIdx + 1}/${list.length}`
                    : `Questão ${q.n}`}{" "}
                  <small>· nº {q.n} na prova</small>
                </span>
                {q.anulada && (
                  <span className="enade-badge enade-badge-anulada">
                    ANULADA
                  </span>
                )}
                {done && !q.anulada && (
                  <span
                    className={`enade-badge ${
                      a === q.ans
                        ? "enade-badge-resp-ok"
                        : "enade-badge-resp-bad"
                    }`}
                  >
                    {a === q.ans ? "VOCÊ ACERTOU" : "VOCÊ ERROU"}
                  </span>
                )}
                <div className="flex-1" />
                {done && (
                  <button
                    className="enade-btn enade-btn-small"
                    onClick={redoQuestion}
                  >
                    Refazer
                  </button>
                )}
              </div>

              <div className="enade-qimgs">
                {q.imgs.map((f, i) => (
                  <img
                    key={i}
                    src={`/enade-img/${q.exam}/${f}`}
                    alt={`Questão ${q.n}`}
                    loading="lazy"
                  />
                ))}
              </div>

              <div className="enade-answers">
                {["A", "B", "C", "D", "E"].map((L) => {
                  let cls = "enade-alt";
                  if (!done && selected === L) cls += " enade-alt-sel";
                  if (done && !q.anulada) {
                    if (L === q.ans) cls += " enade-alt-correct";
                    else if (L === a) cls += " enade-alt-wrong";
                    else cls += " enade-alt-dim";
                  }
                  if (done && q.anulada && L === a) cls += " enade-alt-sel";
                  return (
                    <button
                      key={L}
                      className={cls}
                      disabled={done || q.anulada}
                      onClick={() => setSelected(L)}
                    >
                      {L}
                    </button>
                  );
                })}
                <div className="flex-1" />
                {!done && !q.anulada && (
                  <button
                    className="enade-btn enade-btn-primary"
                    disabled={!selected}
                    onClick={confirmAnswer}
                  >
                    Responder
                  </button>
                )}
              </div>

              {q.anulada && (
                <div className="enade-feedback enade-feedback-warn">
                  Questão anulada pelo INEP — não conta pontos.
                </div>
              )}
              {done && !q.anulada && (
                <div
                  className={`enade-feedback ${
                    a === q.ans
                      ? "enade-feedback-ok"
                      : "enade-feedback-bad"
                  }`}
                >
                  {a === q.ans ? "✔ Correto!" : "✘ Errado."} Gabarito:{" "}
                  <b>{q.ans}</b>
                </div>
              )}
            </div>

            {/* Nav buttons */}
            <div className="enade-navrow">
              <button
                className="enade-btn"
                disabled={safeIdx === 0}
                onClick={() => {
                  setIdx((i) => i - 1);
                  setSelected(null);
                  window.scrollTo({ top: 0 });
                }}
              >
                ← Anterior
              </button>
              <button
                className="enade-btn"
                disabled={safeIdx >= list.length - 1}
                onClick={() => {
                  setIdx((i) => i + 1);
                  setSelected(null);
                  window.scrollTo({ top: 0 });
                }}
              >
                Próxima →
              </button>
              <div className="flex-1" />
              {!isGeral && (
                <button
                  className="enade-btn enade-btn-small"
                  onClick={clearExamAnswers}
                >
                  Limpar respostas desta prova
                </button>
              )}
            </div>

            {/* Chip grid */}
            <div className="enade-navgrid">
              <div className="enade-navgrid-label">Questões</div>
              <div className="enade-chips">
                {list.map((x, i) => {
                  let cls = "enade-chip";
                  if (x.anulada) cls += " enade-chip-anu";
                  else if (answers[qKey(x)] !== undefined) {
                    cls +=
                      !x.anulada && answers[qKey(x)] === x.ans
                        ? " enade-chip-ok"
                        : " enade-chip-bad";
                  }
                  if (i === safeIdx) cls += " enade-chip-cur";
                  return (
                    <button
                      key={i}
                      className={cls}
                      title={`ENADE ${x.ano} · ${x.curso} · Q${x.n}`}
                      onClick={() => {
                        setIdx(i);
                        setSelected(null);
                        window.scrollTo({ top: 0 });
                      }}
                    >
                      {isGeral ? i + 1 : x.n}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
