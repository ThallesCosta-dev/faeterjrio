import { describe, expect, it } from "vitest";
import { corrigir, type QuestaoTopico, type SimuladoQuestao } from "./simulado";

const q = (idx: number, ans: string | null, area = "Conhecimento Específico", anulada = false): SimuladoQuestao => ({
  key: `2021_ads:${idx}`,
  examId: "2021_ads",
  idx,
  n: idx + 1,
  curso: "ADS",
  ano: 2021,
  area,
  imgs: [`q${idx + 1}.png`],
  ans,
  anulada,
});

const topicos: Record<string, QuestaoTopico> = {
  "2021_ads:1": { key: "2021_ads:1", topico: "Banco de Dados", subtopico: "Normalização", resumo: "Formas normais", explicacao: null },
  "2021_ads:2": { key: "2021_ads:2", topico: "Banco de Dados", subtopico: "SQL", resumo: null, explicacao: "LEFT JOIN com IS NULL" },
  "2021_ads:3": { key: "2021_ads:3", topico: "Redes de Computadores", subtopico: null, resumo: null, explicacao: null },
};

describe("corrigir", () => {
  const questoes = [
    q(0, "A", "Formação Geral"),
    q(1, "B"),
    q(2, "C"),
    q(3, "D"),
    q(4, null, "Conhecimento Específico", true),
    q(5, "E"),
  ];

  it("ignora anuladas, conta em branco como erro e calcula a nota", () => {
    const r = corrigir(questoes, { "2021_ads:0": "A", "2021_ads:1": "B", "2021_ads:2": "A", "2021_ads:4": "C" }, topicos);
    expect(r.total).toBe(5);
    expect(r.acertos).toBe(2);
    expect(r.nota).toBe(40);
  });

  it("agrupa por tópico classificado e cai na área quando não há classificação", () => {
    const r = corrigir(questoes, { "2021_ads:1": "B", "2021_ads:3": "D" }, topicos);
    const mapa = Object.fromEntries(r.por_topico.map((t) => [t.topico, `${t.acertos}/${t.total}`]));
    expect(mapa).toEqual({
      "Formação Geral": "0/1",
      "Banco de Dados": "1/2",
      "Redes de Computadores": "1/1",
      "Conhecimento Específico": "0/1",
    });
    expect(r.por_topico[r.por_topico.length - 1].topico).toBe("Redes de Computadores");
  });

  it("lista as erradas com marcação, gabarito e contexto do tópico", () => {
    const r = corrigir(questoes, { "2021_ads:2": "A" }, topicos);
    const sql = r.erradas.find((e) => e.key === "2021_ads:2")!;
    expect(sql).toMatchObject({
      n: 3, topico: "Banco de Dados", subtopico: "SQL", explicacao: "LEFT JOIN com IS NULL", marcada: "A", correta: "C",
    });
    expect(r.erradas.find((e) => e.key === "2021_ads:5")!.marcada).toBeNull();
  });

  it("arredonda a nota para duas casas", () => {
    const tres = [q(1, "A"), q(2, "A"), q(3, "A")];
    expect(corrigir(tres, { "2021_ads:1": "A" }, {}).nota).toBe(33.33);
  });
});
