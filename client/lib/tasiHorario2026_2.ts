export type DiaSemana = "SEG" | "TER" | "QUA" | "QUI" | "SEX" | "SAB";

export type Turno = "MANHÃ" | "TARDE" | "NOITE";

export interface SlotHorario {
  tempo: string;
  hora: string;
}

export interface Aula {
  professor: string;
  disciplina: string;
  modalidade: string;
}

export interface TurmaHorario {
  id: string;
  curso: "TASI";
  periodoLetivo: "2026.2";
  turno: Turno;
  periodo: string;
  turma: string;
  slots: SlotHorario[];
  grid: Record<string, Partial<Record<DiaSemana, Aula>>>;
}

const dias: DiaSemana[] = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const manhaSlots: SlotHorario[] = [
  { tempo: "1°", hora: "07:10~08:00" },
  { tempo: "2°", hora: "08:00~08:50" },
  { tempo: "3°", hora: "08:50~09:40" },
  { tempo: "4°", hora: "09:50~10:40" },
  { tempo: "5°", hora: "10:40~11:30" },
  { tempo: "6°", hora: "11:30~12:20" },
];

const tardeSlots: SlotHorario[] = [
  { tempo: "1°", hora: "13:00~13:50" },
  { tempo: "2°", hora: "13:50~14:40" },
  { tempo: "3°", hora: "14:40~15:30" },
  { tempo: "4°", hora: "15:30~16:20" },
  { tempo: "5°", hora: "16:20~17:10" },
  { tempo: "6°", hora: "17:10~18:00" },
];

const noiteSlots: SlotHorario[] = [
  { tempo: "1°", hora: "18:00~18:40" },
  { tempo: "2°", hora: "18:40~19:20" },
  { tempo: "3°", hora: "19:20~20:00" },
  { tempo: "4°", hora: "20:00~20:40" },
  { tempo: "5°", hora: "20:50~21:30" },
  { tempo: "6°", hora: "21:30~22:10" },
];

// [dia, tempos ("1-4" ou "5"), professor, disciplina, modalidade]
type Entrada = [DiaSemana, string, string, string, string];

const buildTurma = (
  turno: Turno,
  turnoId: string,
  periodo: string,
  periodoNum: number,
  turma: string,
  slots: SlotHorario[],
  entradas: Entrada[],
): TurmaHorario => {
  const grid: Record<string, Partial<Record<DiaSemana, Aula>>> = {};
  for (const s of slots) grid[s.tempo] = {};

  for (const [dia, tempos, professor, disciplina, modalidade] of entradas) {
    const [inicio, fim = inicio] = tempos.split("-").map(Number);
    for (let t = inicio; t <= fim; t++) {
      grid[`${t}°`][dia] = { professor, disciplina, modalidade };
    }
  }

  return {
    id: `TASI-2026.2-${turnoId}-${periodoNum}-${turma}`,
    curso: "TASI",
    periodoLetivo: "2026.2",
    turno,
    periodo,
    turma,
    slots,
    grid,
  };
};

export const turmasTasi2026_2: TurmaHorario[] = [
  buildTurma("MANHÃ", "MANHA", "PRIMEIRO", 1, "A", manhaSlots, [
    ["SEG", "1-2", "ANDRÉ", "1IHM", "Múltipla"],
    ["SEG", "3-6", "EDUARDO BARRETO", "1LPO", "Múltipla"],
    ["TER", "3-6", "JOSÉ WILSON", "1MAB", "Múltipla"],
    ["QUA", "1-2", "BISPO", "1MAC", "Múltipla"],
    ["QUA", "3-6", "GALHANONE", "1ORG", "Múltipla"],
    ["QUI", "1-2", "BISPO", "1MAC", "Múltipla"],
    ["QUI", "3-6", "LEONARDO", "1FAC", "Múltipla"],
    ["SEX", "1-4", "MARCIANO", "1IAS", "Híbrida 1"],
  ]),
  buildTurma("MANHÃ", "MANHA", "PRIMEIRO", 1, "B", manhaSlots, [
    ["QUA", "3-6", "LEONARDO", "1FAC", "Híbrida 1"],
  ]),
  buildTurma("MANHÃ", "MANHA", "SEGUNDO", 2, "A", manhaSlots, [
    ["SEG", "1-2", "EDUARDO BARRETO", "2LES", "Híbrida 2"],
    ["SEG", "5-6", "MARQUES", "2CAW", "Híbrida 2"],
    ["TER", "1-2", "MARQUES", "2CAW", "Híbrida 2"],
    ["TER", "3-4", "MARQUES", "2REQ", "Híbrida 2"],
    ["TER", "5-6", "NELSON", "2MPA", "Híbrida 2"],
    ["QUA", "1-2", "LEONARDO", "2FPR", "Híbrida 1"],
    ["QUA", "3-6", "ZANCO", "2CAL", "Híbrida 2"],
    ["QUI", "1-2", "LEONARDO", "2FPR", "Híbrida 1"],
    ["QUI", "3-6", "RUTE", "2TPH", "Híbrida 2"],
    ["SEX", "1-2", "MARQUES", "2REQ", "Híbrida 2"],
    ["SEX", "3-6", "GALHANONE", "2SOP", "Híbrida 2"],
  ]),
  buildTurma("MANHÃ", "MANHA", "TERCEIRO", 3, "A", manhaSlots, [
    ["SEG", "1-2", "M.CLÁUDIA", "3RSD", "Híbrida 3"],
    ["SEG", "3-6", "ANDRÉ", "3DAW", "Híbrida 1"],
    ["TER", "1-2", "M.CLÁUDIA", "3RSD", "Híbrida 3"],
    ["TER", "3-6", "ZANCO", "3ALG", "Híbrida 3"],
    ["QUA", "3-6", "LOUZADA", "3POB", "Híbrida 3"],
    ["QUI", "1-4", "MARQUES", "3PBD", "Híbrida 3"],
    ["SEX", "3-6", "FERLIN", "3ESD", "Híbrida 3"],
  ]),
  buildTurma("MANHÃ", "MANHA", "QUARTO", 4, "A", manhaSlots, [
    ["SEG", "1-2", "MARQUES", "4MOD", "Híbrida 4"],
    ["SEG", "3-6", "M.CLÁUDIA", "4SEG", "Híbrida 4"],
    ["TER", "1-2", "NELSON", "4EMP", "Híbrida 4"],
    ["TER", "5-6", "MARQUES", "4UBD", "Híbrida 4"],
    ["QUA", "3-6", "BISPO", "4EST", "Híbrida 4"],
    ["QUI", "1-2", "RUTE", "4MET", "Híbrida 4"],
    ["QUI", "5-6", "MARQUES", "4UBD", "Híbrida 4"],
    ["SEX", "1-4", "MIGUEL", "4POA", "Híbrida 4"],
    ["SEX", "5-6", "MARQUES", "4MOD", "Híbrida 4"],
  ]),
  buildTurma("MANHÃ", "MANHA", "QUINTO", 5, "A", manhaSlots, [
    ["SEG", "3-6", "LOUZADA", "5SBD", "Híbrida 5"],
    ["TER", "1-2", "JOSÉ WILSON", "5TFC", "Híbrida 5"],
    ["TER", "3-4", "NELSON", "5GPS", "Híbrida 5"],
    ["QUA", "1-2", "MARCIANO", "5PJS", "Híbrida 5"],
    ["QUA", "3-6", "JOSÉ WILSON", "5TAV", "Híbrida 5"],
    ["SEX", "5-6", "MARCIANO", "5PJS", "Híbrida 5"],
  ]),
  buildTurma("TARDE", "TARDE", "SEGUNDO", 2, "A", tardeSlots, [
    ["TER", "1-2", "JOSÉ WILSON", "EXT 2", "Híbrida 2"],
  ]),
  buildTurma("TARDE", "TARDE", "TERCEIRO", 3, "A", tardeSlots, [
    ["TER", "3-4", "JOSÉ WILSON", "EXT 3", "Híbrida 2"],
  ]),
  buildTurma("TARDE", "TARDE", "QUARTO", 4, "A", tardeSlots, [
    ["TER", "1-4", "BOENTE", "4ADS", "Híbrida 1"],
    ["TER", "5-6", "NELSON", "EXT 4", "Híbrida 1"],
  ]),
  buildTurma("TARDE", "TARDE", "QUINTO", 5, "A", tardeSlots, [
    ["SEG", "1-2", "M.CLÁUDIA", "EXT 5", "Híbrida 2"],
  ]),
  buildTurma("NOITE", "NOITE", "PRIMEIRO", 1, "A", noiteSlots, [
    ["SEG", "1-4", "MARCIANO", "1IAS", "Híbrida 1"],
    ["SEG", "5-6", "ANDRÉ", "1IHM", "Múltipla"],
    ["TER", "1-2", "BOENTE", "1MAB", "Múltipla"],
    ["TER", "3-6", "FERLIN", "1FAC", "Híbrida 1"],
    ["QUA", "3-6", "BISPO", "1MAC", "Múltipla"],
    ["QUI", "1-2", "BOENTE", "1MAB", "Múltipla"],
    ["QUI", "3-6", "EDUARDO BARRETO", "1LPO", "Múltipla"],
    ["SEX", "1-4", "GALHANONE", "1ORG", "Múltipla"],
  ]),
  buildTurma("NOITE", "NOITE", "PRIMEIRO", 1, "B", noiteSlots, [
    ["QUA", "3-6", "FERLIN", "1FAC", "Híbrida 1"],
  ]),
  buildTurma("NOITE", "NOITE", "SEGUNDO", 2, "A", noiteSlots, [
    ["SEG", "1-4", "LEONARDO", "2FPR", "Híbrida 2"],
    ["SEG", "5-6", "MARCIANO", "2CAW", "Híbrida 2"],
    ["TER", "1-4", "ZANCO", "2CAL", "Híbrida 2"],
    ["TER", "5-6", "NELSON", "2MPA", "Híbrida 2"],
    ["QUA", "1-2", "MARCIANO", "2CAW", "Híbrida 2"],
    ["QUA", "3-6", "GALHANONE", "2SOP", "Híbrida 2"],
    ["QUI", "1-2", "EDUARDO BARRETO", "2LES", "Híbrida 2"],
    ["QUI", "3-6", "ROSÂNGELA", "2TPH", "Híbrida 2"],
    ["SEX", "3-6", "BELO", "2REQ", "Híbrida 2"],
  ]),
  buildTurma("NOITE", "NOITE", "TERCEIRO", 3, "A", noiteSlots, [
    ["SEG", "1-4", "ANDRÉ", "3PBD", "Híbrida 3"],
    ["SEG", "5-6", "BELO", "3POB", "Híbrida 3"],
    ["TER", "1-2", "FERLIN", "3ESD", "Híbrida 3"],
    ["TER", "3-6", "BELO", "3DAW", "Híbrida 3"],
    ["QUA", "1-2", "FERLIN", "3ESD", "Híbrida 3"],
    ["QUA", "3-6", "M.CLÁUDIA", "3RSD", "Híbrida 3"],
    ["QUI", "1-4", "BISPO", "3ALG", "Híbrida 3"],
    ["SEX", "1-2", "BELO", "3POB", "Híbrida 3"],
  ]),
  buildTurma("NOITE", "NOITE", "QUARTO", 4, "A", noiteSlots, [
    ["SEG", "1-4", "BELO", "4MOD", "Híbrida 4"],
    ["TER", "1-2", "NELSON", "4EMP", "Híbrida 4"],
    ["TER", "3-6", "BOENTE", "4SEG", "Híbrida 4"],
    ["QUA", "1-2", "BISPO", "4EST", "Híbrida 4"],
    ["QUA", "3-4", "BOENTE", "4UBD", "Híbrida 4"],
    ["QUI", "1-2", "ROSÂNGELA", "4MET", "Híbrida 4"],
    ["QUI", "3-4", "BOENTE", "4UBD", "Híbrida 4"],
    ["QUI", "5-6", "BISPO", "4EST", "Híbrida 3"],
    ["SEX", "3-6", "MIGUEL", "4POA", "Híbrida 4"],
  ]),
  buildTurma("NOITE", "NOITE", "QUINTO", 5, "A", noiteSlots, [
    ["TER", "1-2", "BELO", "5TFC", "Híbrida 5"],
    ["TER", "3-4", "NELSON", "5GPS", "Híbrida 5"],
    ["QUA", "1-4", "ANDRÉ", "5SBD", "Híbrida 5"],
    ["QUA", "5-6", "MARCIANO", "5PJS", "Híbrida 5"],
    ["QUI", "1-4", "MIGUEL", "5PDM", "Híbrida 5"],
    ["QUI", "5-6", "MIGUEL", "5TAV", "Híbrida 5"],
    ["SEX", "1-2", "MIGUEL", "5TAV", "Híbrida 5"],
    ["SEX", "3-4", "MARCIANO", "5PJS", "Híbrida 5"],
  ]),
];

export const diasSemana: DiaSemana[] = dias;
