import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ParsedAula {
  professor: string;
  disciplina: string;
  modalidade: string;
}

export interface ParsedSlot {
  tempo: string;
  hora: string;
}

export interface ParsedTurma {
  turno: string;
  periodo: string;
  turma: string;
  slots: ParsedSlot[];
  grid: Record<string, Partial<Record<string, ParsedAula>>>;
}

export interface ParsedHorario {
  curso: string;
  periodoLetivo: string;
  turmas: ParsedTurma[];
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  w: number;
}

const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"] as const;

const TURNO_SLOTS: Record<string, ParsedSlot[]> = {
  MANHÃ: [
    { tempo: "1°", hora: "07:10~08:00" },
    { tempo: "2°", hora: "08:00~08:50" },
    { tempo: "3°", hora: "08:50~09:40" },
    { tempo: "4°", hora: "09:50~10:40" },
    { tempo: "5°", hora: "10:40~11:30" },
    { tempo: "6°", hora: "11:30~12:20" },
  ],
  TARDE: [
    { tempo: "1°", hora: "13:00~13:50" },
    { tempo: "2°", hora: "13:50~14:40" },
    { tempo: "3°", hora: "14:40~15:30" },
    { tempo: "4°", hora: "15:30~16:20" },
    { tempo: "5°", hora: "16:20~17:10" },
    { tempo: "6°", hora: "17:10~18:00" },
  ],
  NOITE: [
    { tempo: "1°", hora: "18:00~18:40" },
    { tempo: "2°", hora: "18:40~19:20" },
    { tempo: "3°", hora: "19:20~20:00" },
    { tempo: "4°", hora: "20:00~20:40" },
    { tempo: "5°", hora: "20:50~21:30" },
    { tempo: "6°", hora: "21:30~22:10" },
  ],
};

const SECTION_RE =
  /^(MANHÃ|TARDE|NOITE)\s*-\s*(PRIMEIRO|SEGUNDO|TERCEIRO|QUARTO|QUINTO|SEXTO|SÉTIMO|OITAVO)\s*-\s*([A-Z])$/;

const SLOT_RE = /^([1-6])°$/;
const TIME_RE = /\d{2}:\d{2}~\d{2}:\d{2}/;
const MODALIDADE_RE = /^(Múltipla|Híbrida\s*\d+|Presencial|EAD|Remota)$/i;
const DISC_RE = /^(?:\d[A-Z]{2,4}|EXT\s*\d+)$/;

function detectColumn(x: number, colBounds: number[]): number {
  for (let i = colBounds.length - 1; i >= 0; i--) {
    if (x >= colBounds[i] - 15) return i;
  }
  return -1;
}

async function extractItems(page: pdfjsLib.PDFPageProxy): Promise<TextItem[]> {
  const content = await page.getTextContent();
  return content.items
    .filter((item: any) => item.str && item.str.trim())
    .map((item: any) => ({
      str: item.str.trim(),
      x: Math.round(item.transform[4]),
      y: Math.round(item.transform[5]),
      w: Math.round(item.width),
    }));
}

function groupByY(items: TextItem[], tolerance = 3): Map<number, TextItem[]> {
  const groups = new Map<number, TextItem[]>();
  const sorted = [...items].sort((a, b) => b.y - a.y);

  for (const item of sorted) {
    let matched = false;
    for (const [ky, arr] of groups) {
      if (Math.abs(item.y - ky) <= tolerance) {
        arr.push(item);
        matched = true;
        break;
      }
    }
    if (!matched) groups.set(item.y, [item]);
  }

  return groups;
}

function findColumnBounds(items: TextItem[]): number[] | null {
  for (const item of items) {
    if (item.str === "Tempo") {
      const rowY = item.y;
      const rowItems = items.filter((i) => Math.abs(i.y - rowY) <= 3);
      const headerItems = rowItems
        .filter((i) => DIAS.includes(i.str as any))
        .sort((a, b) => a.x - b.x);

      if (headerItems.length >= 5) {
        return headerItems.map((h) => h.x);
      }
    }
  }
  return null;
}

function parseCellItems(
  cellItems: TextItem[]
): ParsedAula | null {
  if (!cellItems.length) return null;

  const texts = cellItems
    .sort((a, b) => b.y - a.y || a.x - b.x)
    .map((i) => i.str);

  let professor = "";
  let disciplina = "";
  let modalidade = "";

  for (const t of texts) {
    if (TIME_RE.test(t)) continue;
    if (MODALIDADE_RE.test(t)) {
      modalidade = t;
    } else if (DISC_RE.test(t)) {
      disciplina = t;
    } else if (
      t.length > 1 &&
      !SLOT_RE.test(t) &&
      t !== "Tempo" &&
      !DIAS.includes(t as any)
    ) {
      if (!professor) professor = t;
      else professor += " " + t;
    }
  }

  if (!professor && !disciplina) return null;
  return { professor, disciplina, modalidade };
}

export async function parseHorarioPdf(
  file: File
): Promise<ParsedHorario> {
  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;

  let curso = "";
  let periodoLetivo = "";
  const turmas: ParsedTurma[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const allItems = await extractItems(page);

    // Extract curso and periodo from header
    if (!curso) {
      const headerItem = allItems.find((i) =>
        i.str.includes("Grade de horário do curso")
      );
      if (headerItem) {
        const m = headerItem.str.match(/curso\s*:\s*(.+)/i);
        if (m) curso = m[1].trim();
      }
      const periodoItem = allItems.find((i) =>
        i.str.includes("Período Letivo")
      );
      if (periodoItem) {
        const m = periodoItem.str.match(/Período Letivo\s*:\s*(.+)/i);
        if (m) periodoLetivo = m[1].trim();
      }
    }

    // Find column positions from header row
    const colBounds = findColumnBounds(allItems);
    if (!colBounds) continue;

    // Detect all section headers and slot rows
    const sections: { y: number; turno: string; periodo: string; turma: string }[] = [];
    const slotRows: { y: number; slot: string }[] = [];

    const yGroups = groupByY(allItems);
    const sortedYs = [...yGroups.keys()].sort((a, b) => b - a);

    for (const gy of sortedYs) {
      const row = yGroups.get(gy)!;
      const combined = row
        .sort((a, b) => a.x - b.x)
        .map((i) => i.str)
        .join(" ");

      const sectionMatch = combined.match(SECTION_RE);
      if (sectionMatch) {
        sections.push({
          y: gy,
          turno: sectionMatch[1],
          periodo: sectionMatch[2],
          turma: sectionMatch[3],
        });
        continue;
      }

      for (const item of row) {
        const slotMatch = item.str.match(SLOT_RE);
        if (slotMatch && item.x < 80) {
          slotRows.push({ y: gy, slot: `${slotMatch[1]}°` });
        }
      }
    }

    // Process each section
    for (let si = 0; si < sections.length; si++) {
      const sec = sections[si];
      const nextSecY = si + 1 < sections.length ? sections[si + 1].y : -Infinity;

      const slotsInSection = slotRows
        .filter((s) => s.y < sec.y && s.y > nextSecY)
        .sort((a, b) => b.y - a.y);

      const grid: Record<string, Partial<Record<string, ParsedAula>>> = {};
      const slots = TURNO_SLOTS[sec.turno] || TURNO_SLOTS.MANHÃ;

      for (const s of slots) {
        grid[s.tempo] = {};
      }

      for (let ri = 0; ri < slotsInSection.length; ri++) {
        const slotRow = slotsInSection[ri];
        const nextSlotY =
          ri + 1 < slotsInSection.length
            ? slotsInSection[ri + 1].y
            : nextSecY;

        // Collect items in this slot's Y range, excluding footer/header items
        const slotItems = allItems.filter(
          (i) =>
            i.y <= slotRow.y + 3 &&
            i.y > nextSlotY &&
            i.x > 70
        );

        // Group by column
        for (let ci = 0; ci < colBounds.length; ci++) {
          const colStart = colBounds[ci] - 15;
          const colEnd =
            ci + 1 < colBounds.length
              ? colBounds[ci + 1] - 15
              : 900;

          const cellItems = slotItems.filter(
            (i) => i.x >= colStart && i.x < colEnd
          );

          const aula = parseCellItems(cellItems);
          if (aula) {
            grid[slotRow.slot] = grid[slotRow.slot] || {};
            grid[slotRow.slot][DIAS[ci]] = aula;
          }
        }
      }

      turmas.push({
        turno: sec.turno,
        periodo: sec.periodo,
        turma: sec.turma,
        slots,
        grid,
      });
    }
  }

  if (!curso) curso = "TASI (Tecnologia Em Análise e Desenvolvimento De Sistemas)";
  if (!periodoLetivo) periodoLetivo = "N/A";

  return { curso, periodoLetivo, turmas };
}
