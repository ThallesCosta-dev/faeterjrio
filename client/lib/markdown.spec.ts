import { describe, expect, it } from "vitest";
import { converterMarkdown } from "./markdown";

describe("converterMarkdown", () => {
  it("converte títulos, listas separadas e ênfase", () => {
    const html = converterMarkdown(
      "## Seu desempenho\nVocê acertou **12** de 20.\n\n- Banco de Dados\n- Redes\n\n1. Revisar SQL\n2. Fazer *listas*",
    );
    expect(html).toBe(
      "<h3>Seu desempenho</h3><p>Você acertou <strong>12</strong> de 20.</p>" +
        "<ul><li>Banco de Dados</li><li>Redes</li></ul>" +
        "<ol><li>Revisar SQL</li><li>Fazer <em>listas</em></li></ol>",
    );
  });

  it("escapa HTML vindo da IA", () => {
    expect(converterMarkdown('<img src=x onerror="alert(1)"> oi')).toBe(
      '<p>&lt;img src=x onerror="alert(1)"&gt; oi</p>',
    );
  });

  it("renderiza tabelas pipe ignorando a linha separadora", () => {
    expect(converterMarkdown("| Tópico | % |\n|---|---|\n| BD | 40 |")).toBe(
      "<table><thead><tr><th>Tópico</th><th>%</th></tr></thead><tbody><tr><td>BD</td><td>40</td></tr></tbody></table>",
    );
  });
});
