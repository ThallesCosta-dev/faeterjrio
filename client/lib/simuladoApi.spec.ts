import { describe, expect, it } from "vitest";
import { lerParticipantes } from "./simuladoApi";

describe("lerParticipantes", () => {
  it("lê linhas coladas de planilha com email, nome e matrícula em qualquer ordem", () => {
    const { participantes, invalidas } = lerParticipantes(
      [
        "Maria.Souza@faeterj-rio.edu.br\tMaria Souza\t20231234567",
        "20221112223;João da Silva;joao.silva@faeterj-rio.edu.br",
        "ana@faeterj-rio.edu.br",
        "",
        "Fulano sem email 2023999",
      ].join("\n"),
    );
    expect(participantes).toEqual([
      { email: "maria.souza@faeterj-rio.edu.br", nome: "Maria Souza", matricula: "20231234567" },
      { email: "joao.silva@faeterj-rio.edu.br", nome: "João da Silva", matricula: "20221112223" },
      { email: "ana@faeterj-rio.edu.br", nome: null, matricula: null },
    ]);
    expect(invalidas).toEqual(["Fulano sem email 2023999"]);
  });

  it("remove duplicados mantendo a última ocorrência", () => {
    const { participantes } = lerParticipantes("a@x.com\nA@X.COM  Ana Lima");
    expect(participantes).toEqual([{ email: "a@x.com", nome: "Ana Lima", matricula: null }]);
  });
});
