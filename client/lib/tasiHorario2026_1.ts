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
  periodoLetivo: "2026.1";
  turno: Turno;
  periodo: string;
  turma: string;
  slots: SlotHorario[];
  grid: Record<string, Partial<Record<DiaSemana, Aula>>>;
}

const dias: DiaSemana[] = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const emptyGrid = (slots: SlotHorario[]) => {
  const g: Record<string, Partial<Record<DiaSemana, Aula>>> = {};
  for (const s of slots) g[s.tempo] = {};
  return g;
};

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

export const turmasTasi2026_1: TurmaHorario[] = [
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["1°"].SEG = { professor: "ANDRÉ", disciplina: "1IHM", modalidade: "Múltipla" };
    grid["2°"].SEG = { professor: "ANDRÉ", disciplina: "1IHM", modalidade: "Múltipla" };
    grid["3°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };
    grid["4°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };
    grid["5°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };
    grid["6°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };


    grid["3°"].TER = { professor: "ZANCO", disciplina: "1MAB", modalidade: "Múltipla" };
    grid["4°"].TER = { professor: "ZANCO", disciplina: "1MAB", modalidade: "Múltipla" };
    grid["5°"].TER = { professor: "ZANCO", disciplina: "1MAB", modalidade: "Múltipla" };
    grid["6°"].TER = { professor: "ZANCO", disciplina: "1MAB", modalidade: "Múltipla" };

    grid["1°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["2°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["3°"].QUA = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };
    grid["4°"].QUA = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };
    grid["5°"].QUA = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };
    grid["6°"].QUA = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };

    grid["1°"].QUI = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["2°"].QUI = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["3°"].QUI = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Múltipla" };
    grid["4°"].QUI = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Múltipla" };
    grid["5°"].QUI = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Múltipla" };
    grid["6°"].QUI = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Múltipla" };

    grid["1°"].SEX = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Múltipla" };
    grid["2°"].SEX = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Múltipla" };
    grid["3°"].SEX = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Múltipla" };
    grid["4°"].SEX = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Múltipla" };

    return {
      id: "TASI-2026.1-MANHA-1-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "PRIMEIRO",
      turma: "A",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["3°"].QUA = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Híbrida 1" };
    grid["4°"].QUA = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Híbrida 1" };
    grid["5°"].QUA = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Híbrida 1" };
    grid["6°"].QUA = { professor: "LEONARDO", disciplina: "1FAC", modalidade: "Híbrida 1" };

    return {
      id: "TASI-2026.1-MANHA-1-B",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "PRIMEIRO",
      turma: "B",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["1°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "2LES", modalidade: "Híbrida 2" };
    grid["2°"].SEG = { professor: "EDUARDO BARRETO", disciplina: "2LES", modalidade: "Híbrida 2" };

    
    
    grid["5°"].SEG = { professor: "MARQUES", disciplina: "2CAW", modalidade: "Híbrida 2" };
    grid["6°"].SEG = { professor: "MARQUES", disciplina: "2CAW", modalidade: "Híbrida 2" };

    grid["1°"].TER = { professor: "MARQUES", disciplina: "2CAW", modalidade: "Híbrida 2" };
    grid["2°"].TER = { professor: "MARQUES", disciplina: "2CAW", modalidade: "Híbrida 2" };
    grid["3°"].TER = { professor: "MARQUES", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["4°"].TER = { professor: "MARQUES", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["5°"].TER = { professor: "NELSON", disciplina: "2MPA", modalidade: "Híbrida 2" };
    grid["6°"].TER = { professor: "NELSON", disciplina: "2MPA", modalidade: "Híbrida 2" };

    grid["1°"].QUA = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["2°"].QUA = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };

    grid["3°"].QUA = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["4°"].QUA = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["5°"].QUA = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["6°"].QUA = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };

    grid["1°"].QUI = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["2°"].QUI = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["3°"].QUI = { professor: "RUTE", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["4°"].QUI = { professor: "RUTE", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["5°"].QUI = { professor: "RUTE", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["6°"].QUI = { professor: "RUTE", disciplina: "2TPH", modalidade: "Híbrida 2" };

    grid["1°"].SEX = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["2°"].SEX = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["3°"].SEX = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["4°"].SEX = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };

    grid["5°"].SEX = { professor: "MARQUES", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["6°"].SEX = { professor: "MARQUES", disciplina: "2REQ", modalidade: "Híbrida 2" };

    return {
      id: "TASI-2026.1-MANHA-2-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "SEGUNDO",
      turma: "A",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["1°"].TER = { professor: "ZANCO", disciplina: "3ALG", modalidade: "Híbrida 3" };
    grid["2°"].TER = { professor: "ZANCO", disciplina: "3ALG", modalidade: "Híbrida 3" };

    grid["1°"].QUA = { professor: "ZANCO", disciplina: "3ALG", modalidade: "Híbrida 3" };
    grid["2°"].QUA = { professor: "ZANCO", disciplina: "3ALG", modalidade: "Híbrida 3" };

    grid["1°"].QUI = { professor: "MARQUES", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["2°"].QUI = { professor: "MARQUES", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["3°"].QUI = { professor: "MARQUES", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["4°"].QUI = { professor: "MARQUES", disciplina: "3PBD", modalidade: "Híbrida 3" };

    grid["5°"].SEX = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };
    grid["6°"].SEX = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };

    grid["3°"].SEG = { professor: "ANDRÉ", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["4°"].SEG = { professor: "ANDRÉ", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["5°"].SEG = { professor: "ANDRÉ", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["6°"].SEG = { professor: "ANDRÉ", disciplina: "3DAW", modalidade: "Híbrida 3" };

    grid["3°"].TER = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["4°"].TER = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["5°"].TER = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["6°"].TER = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };

    grid["3°"].QUA = { professor: "LOUZADA", disciplina: "3POB", modalidade: "Híbrida 3" };
    grid["4°"].QUA = { professor: "LOUZADA", disciplina: "3POB", modalidade: "Híbrida 3" };
    grid["5°"].QUA = { professor: "LOUZADA", disciplina: "3POB", modalidade: "Híbrida 3" };
    grid["6°"].QUA = { professor: "LOUZADA", disciplina: "3POB", modalidade: "Híbrida 3" };

    grid["3°"].SEX = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };
    grid["4°"].SEX = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };

    return {
      id: "TASI-2026.1-MANHA-3-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "TERCEIRO",
      turma: "A",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["1°"].SEG = { professor: "M.CLÁUDIA", disciplina: "4SEG", modalidade: "Híbrida 4" };
    grid["2°"].SEG = { professor: "M.CLÁUDIA", disciplina: "4SEG", modalidade: "Híbrida 4" };

    grid["1°"].TER = { professor: "M.CLÁUDIA", disciplina: "4SEG", modalidade: "Híbrida 4" };
    grid["2°"].TER = { professor: "M.CLÁUDIA", disciplina: "4SEG", modalidade: "Híbrida 4" };

    grid["1°"].QUI = { professor: "RUTE", disciplina: "4MET", modalidade: "Híbrida 4" };
    grid["2°"].QUI = { professor: "RUTE", disciplina: "4MET", modalidade: "Híbrida 4" };

    grid["3°"].SEG = { professor: "MARQUES", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["4°"].SEG = { professor: "MARQUES", disciplina: "4MOD", modalidade: "Híbrida 4" };



    grid["3°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["4°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["5°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["6°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };

    grid["1°"].SEX = { professor: "MARQUES", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["2°"].SEX = { professor: "MARQUES", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["3°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["4°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["5°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["6°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };

    grid["5°"].TER = { professor: "MARQUES", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["6°"].TER = { professor: "MARQUES", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["5°"].QUI = { professor: "MARQUES", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["6°"].QUI = { professor: "MARQUES", disciplina: "4UBD", modalidade: "Híbrida 4" };

    return {
      id: "TASI-2026.1-MANHA-4-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "QUARTO",
      turma: "A",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(manhaSlots);
    grid["1°"].SEG = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };
    grid["2°"].SEG = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };

    grid["3°"].SEG = { professor: "LOUZADA", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["4°"].SEG = { professor: "LOUZADA", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["5°"].SEG = { professor: "LOUZADA", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["6°"].SEG = { professor: "LOUZADA", disciplina: "5SBD", modalidade: "Híbrida 5" };

    grid["1°"].TER = { professor: "NELSON", disciplina: "5GPS", modalidade: "Híbrida 5" };
    grid["2°"].TER = { professor: "NELSON", disciplina: "5GPS", modalidade: "Híbrida 5" };

    grid["5°"].QUI = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };
    grid["6°"].QUI = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };

    return {
      id: "TASI-2026.1-MANHA-5-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "MANHÃ",
      periodo: "QUINTO",
      turma: "A",
      slots: manhaSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(tardeSlots);
    grid["2°"].TER = { professor: "BOENTE", disciplina: "4ADS", modalidade: "Híbrida 4" };
    grid["3°"].TER = { professor: "BOENTE", disciplina: "4ADS", modalidade: "Híbrida 4" };
    grid["4°"].TER = { professor: "BOENTE", disciplina: "4ADS", modalidade: "Híbrida 4" };
    grid["5°"].TER = { professor: "BOENTE", disciplina: "4ADS", modalidade: "Híbrida 4" };

    return {
      id: "TASI-2026.1-TARDE-4-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "TARDE",
      periodo: "QUARTO",
      turma: "A",
      slots: tardeSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(tardeSlots);
    grid["1°"].SEG = { professor: "LOUZADA", disciplina: "5TFC", modalidade: "Híbrida 5" };
    grid["2°"].SEG = { professor: "LOUZADA", disciplina: "5TFC", modalidade: "Híbrida 5" };

    return {
      id: "TASI-2026.1-TARDE-5-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "TARDE",
      periodo: "QUINTO",
      turma: "A",
      slots: tardeSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(noiteSlots);
    grid["1°"].SEG = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Híbrida 1" };
    grid["2°"].SEG = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Híbrida 1" };
    grid["3°"].SEG = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Híbrida 1" };
    grid["4°"].SEG = { professor: "MARCIANO", disciplina: "1IAS", modalidade: "Híbrida 1" };

    grid["1°"].TER = { professor: "BOENTE", disciplina: "1MAB", modalidade: "Múltipla" };
    grid["2°"].TER = { professor: "BOENTE", disciplina: "1MAB", modalidade: "Múltipla" };

    grid["1°"].QUA = { professor: "BOENTE", disciplina: "1MAB", modalidade: "Múltipla" };
    grid["2°"].QUA = { professor: "BOENTE", disciplina: "1MAB", modalidade: "Múltipla" };

    grid["1°"].SEX = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };
    grid["2°"].SEX = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };

    grid["3°"].TER = { professor: "FERLIN", disciplina: "1FAC", modalidade: "Híbrida 1" };
    grid["4°"].TER = { professor: "FERLIN", disciplina: "1FAC", modalidade: "Híbrida 1" };

    grid["3°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["4°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };

    grid["3°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };
    grid["4°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };

    grid["3°"].SEX = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };
    grid["4°"].SEX = { professor: "GALHANONE", disciplina: "1ORG", modalidade: "Múltipla" };

    grid["5°"].SEG = { professor: "ANDRÉ", disciplina: "1IHM", modalidade: "Múltipla" };
    grid["6°"].SEG = { professor: "ANDRÉ", disciplina: "1IHM", modalidade: "Múltipla" };

    grid["5°"].TER = { professor: "FERLIN", disciplina: "1FAC", modalidade: "Híbrida 1" };
    grid["6°"].TER = { professor: "FERLIN", disciplina: "1FAC", modalidade: "Híbrida 1" };

    grid["5°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };
    grid["6°"].QUA = { professor: "BISPO", disciplina: "1MAC", modalidade: "Múltipla" };

    grid["5°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };
    grid["6°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "1LPO", modalidade: "Múltipla" };

    return {
      id: "TASI-2026.1-NOITE-1-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "NOITE",
      periodo: "PRIMEIRO",
      turma: "A",
      slots: noiteSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(noiteSlots);
    grid["1°"].SEG = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["2°"].SEG = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["3°"].SEG = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };
    grid["4°"].SEG = { professor: "LEONARDO", disciplina: "2FPR", modalidade: "Híbrida 2" };

    grid["5°"].SEG = { professor: "MARCIANO", disciplina: "2CAW", modalidade: "Híbrida 2" };
    grid["6°"].SEG = { professor: "MARCIANO", disciplina: "2CAW", modalidade: "Híbrida 2" };

    grid["1°"].TER = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["2°"].TER = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["3°"].TER = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };
    grid["4°"].TER = { professor: "ZANCO", disciplina: "2CAL", modalidade: "Híbrida 2" };

    grid["5°"].TER = { professor: "NELSON", disciplina: "2MPA", modalidade: "Híbrida 2" };
    grid["6°"].TER = { professor: "NELSON", disciplina: "2MPA", modalidade: "Híbrida 2" };

    grid["1°"].QUA = { professor: "MARCIANO", disciplina: "2CAW", modalidade: "Híbrida 2" };
    grid["2°"].QUA = { professor: "MARCIANO", disciplina: "2CAW", modalidade: "Híbrida 2" };

    grid["1°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "2LES", modalidade: "Híbrida 2" };
    grid["2°"].QUI = { professor: "EDUARDO BARRETO", disciplina: "2LES", modalidade: "Híbrida 2" };

    grid["3°"].QUA = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["4°"].QUA = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["5°"].QUA = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["6°"].QUA = { professor: "GALHANONE", disciplina: "2SOP", modalidade: "Híbrida 2" };
    grid["3°"].QUI = { professor: "ROSÂNGELA", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["4°"].QUI = { professor: "ROSÂNGELA", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["5°"].QUI = { professor: "ROSÂNGELA", disciplina: "2TPH", modalidade: "Híbrida 2" };
    grid["6°"].QUI = { professor: "ROSÂNGELA", disciplina: "2TPH", modalidade: "Híbrida 2" };

    grid["3°"].SEX = { professor: "BELO", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["4°"].SEX = { professor: "BELO", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["5°"].SEX = { professor: "BELO", disciplina: "2REQ", modalidade: "Híbrida 2" };
    grid["6°"].SEX = { professor: "BELO", disciplina: "2REQ", modalidade: "Híbrida 2" };

    return {
      id: "TASI-2026.1-NOITE-2-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "NOITE",
      periodo: "SEGUNDO",
      turma: "A",
      slots: noiteSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(noiteSlots);
    grid["1°"].SEG = { professor: "ANDRÉ", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["2°"].SEG = { professor: "ANDRÉ", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["3°"].SEG = { professor: "ANDRÉ", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["4°"].SEG = { professor: "ANDRÉ", disciplina: "3PBD", modalidade: "Híbrida 3" };
    grid["5°"].SEG = { professor: "BELO", disciplina: "3POB", modalidade: "Híbrida 3" };
    grid["6°"].SEG = { professor: "BELO", disciplina: "3POB", modalidade: "Híbrida 3" };

    grid["1°"].TER = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };
    grid["2°"].TER = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };
    grid["3°"].TER = { professor: "BELO", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["4°"].TER = { professor: "BELO", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["5°"].TER = { professor: "BELO", disciplina: "3DAW", modalidade: "Híbrida 3" };
    grid["6°"].TER = { professor: "BELO", disciplina: "3DAW", modalidade: "Híbrida 3" };

    grid["1°"].QUA = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["2°"].QUA = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["3°"].QUA = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["4°"].QUA = { professor: "M.CLÁUDIA", disciplina: "3RSD", modalidade: "Híbrida 3" };
    grid["5°"].QUA = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };
    grid["6°"].QUA = { professor: "FERLIN", disciplina: "3ESD", modalidade: "Híbrida 3" };

    grid["1°"].QUI = { professor: "BISPO", disciplina: "3ALG", modalidade: "Híbrida 3" };
    grid["2°"].QUI = { professor: "BISPO", disciplina: "3ALG", modalidade: "Híbrida 3" };
    grid["3°"].QUI = { professor: "BISPO", disciplina: "3ALG", modalidade: "Híbrida 3" };
    grid["4°"].QUI = { professor: "BISPO", disciplina: "3ALG", modalidade: "Híbrida 3" };

    grid["1°"].SEX = { professor: "BELO", disciplina: "3POB", modalidade: "Híbrida 3" };
    grid["2°"].SEX = { professor: "BELO", disciplina: "3POB", modalidade: "Híbrida 3" };

    return {
      id: "TASI-2026.1-NOITE-3-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "NOITE",
      periodo: "TERCEIRO",
      turma: "A",
      slots: noiteSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(noiteSlots);
    grid["1°"].SEG = { professor: "BELO", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["2°"].SEG = { professor: "BELO", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["3°"].SEG = { professor: "BELO", disciplina: "4MOD", modalidade: "Híbrida 4" };
    grid["4°"].SEG = { professor: "BELO", disciplina: "4MOD", modalidade: "Híbrida 4" };

    grid["1°"].TER = { professor: "NELSON", disciplina: "4EMP", modalidade: "Híbrida 4" };
    grid["2°"].TER = { professor: "NELSON", disciplina: "4EMP", modalidade: "Híbrida 4" };
    grid["3°"].TER = { professor: "BOENTE", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["4°"].TER = { professor: "BOENTE", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["5°"].TER = { professor: "BOENTE", disciplina: "4UBD", modalidade: "Híbrida 4" };
    grid["6°"].TER = { professor: "BOENTE", disciplina: "4UBD", modalidade: "Híbrida 4" };

    grid["1°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["2°"].QUA = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["3°"].QUA = { professor: "BOENTE", disciplina: "4SEG", modalidade: "Híbrida 4" };
    grid["4°"].QUA = { professor: "BOENTE", disciplina: "4SEG", modalidade: "Híbrida 4" };
    grid["5°"].QUA = { professor: "BOENTE", disciplina: "4SEG", modalidade: "Híbrida 4" };
    grid["6°"].QUA = { professor: "BOENTE", disciplina: "4SEG", modalidade: "Híbrida 4" };

    grid["1°"].QUI = { professor: "ROSÂNGELA", disciplina: "4MET", modalidade: "Híbrida 4" };
    grid["2°"].QUI = { professor: "ROSÂNGELA", disciplina: "4MET", modalidade: "Híbrida 4" };
    grid["5°"].QUI = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };
    grid["6°"].QUI = { professor: "BISPO", disciplina: "4EST", modalidade: "Híbrida 4" };

    grid["3°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["4°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["5°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };
    grid["6°"].SEX = { professor: "MIGUEL", disciplina: "4POA", modalidade: "Híbrida 4" };


    return {
      id: "TASI-2026.1-NOITE-4-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "NOITE",
      periodo: "QUARTO",
      turma: "A",
      slots: noiteSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
  (() => {
    const grid = emptyGrid(noiteSlots);
    grid["1°"].TER = { professor: "BELO", disciplina: "5TFC", modalidade: "Híbrida 5" };
    grid["2°"].TER = { professor: "BELO", disciplina: "5TFC", modalidade: "Híbrida 5" };
    grid["3°"].TER = { professor: "NELSON", disciplina: "5GPS", modalidade: "Híbrida 5" };
    grid["4°"].TER = { professor: "NELSON", disciplina: "5GPS", modalidade: "Híbrida 5" };
    grid["5°"].QUA = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };
    grid["6°"].QUA = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };

    grid["1°"].QUA = { professor: "ANDRÉ", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["2°"].QUA = { professor: "ANDRÉ", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["3°"].QUA = { professor: "ANDRÉ", disciplina: "5SBD", modalidade: "Híbrida 5" };
    grid["4°"].QUA = { professor: "ANDRÉ", disciplina: "5SBD", modalidade: "Híbrida 5" };

    grid["1°"].QUI = { professor: "MIGUEL", disciplina: "5TAV", modalidade: "Híbrida 5" };
    grid["2°"].QUI = { professor: "MIGUEL", disciplina: "5TAV", modalidade: "Híbrida 5" };
    grid["3°"].QUI = { professor: "MIGUEL", disciplina: "5PDM", modalidade: "Híbrida 5" };
    grid["4°"].QUI = { professor: "MIGUEL", disciplina: "5PDM", modalidade: "Híbrida 5" };
    grid["5°"].QUI = { professor: "MIGUEL", disciplina: "5PDM", modalidade: "Híbrida 5" };
    grid["6°"].QUI = { professor: "MIGUEL", disciplina: "5PDM", modalidade: "Híbrida 5" };

    grid["1°"].SEX = { professor: "MIGUEL", disciplina: "5TAV", modalidade: "Híbrida 5" };
    grid["2°"].SEX = { professor: "MIGUEL", disciplina: "5TAV", modalidade: "Híbrida 5" };
    grid["3°"].SEX = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };
    grid["4°"].SEX = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };

    grid["3°"].SEX = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };
    grid["4°"].SEX = { professor: "MARCIANO", disciplina: "5PJS", modalidade: "Híbrida 5" };

    return {
      id: "TASI-2026.1-NOITE-5-A",
      curso: "TASI",
      periodoLetivo: "2026.1",
      turno: "NOITE",
      periodo: "QUINTO",
      turma: "A",
      slots: noiteSlots,
      grid,
    } satisfies TurmaHorario;
  })(),
];

export const diasSemana: DiaSemana[] = dias;
