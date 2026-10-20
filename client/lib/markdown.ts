import DOMPurify from "dompurify";

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inline = (s: string) =>
  escapar(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");

/** Minimal markdown → sanitized HTML for AI-generated text (headings, lists, tables, emphasis). */
export function markdownParaHtml(md: string): string {
  return DOMPurify.sanitize(converterMarkdown(md));
}

export function converterMarkdown(md: string): string {
  const out: string[] = [];
  let lista: "ul" | "ol" | null = null;
  let paragrafo: string[] = [];
  let tabela: string[][] = [];

  const fecharParagrafo = () => {
    if (paragrafo.length) out.push(`<p>${paragrafo.join("<br>")}</p>`);
    paragrafo = [];
  };
  const fecharLista = () => {
    if (lista) out.push(`</${lista}>`);
    lista = null;
  };
  const fecharTabela = () => {
    if (!tabela.length) return;
    const [cab, ...linhas] = tabela;
    out.push(
      `<table><thead><tr>${cab.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>` +
        linhas.map((l) => `<tr>${l.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
        `</tbody></table>`,
    );
    tabela = [];
  };
  const fecharTudo = () => {
    fecharParagrafo();
    fecharLista();
    fecharTabela();
  };

  for (const bruta of md.replace(/\r/g, "").split("\n")) {
    const linha = bruta.trimEnd();
    if (!linha.trim()) {
      fecharTudo();
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(linha)) {
      fecharParagrafo();
      fecharLista();
      if (!/^\s*\|[\s:|-]+\|\s*$/.test(linha)) {
        tabela.push(linha.trim().slice(1, -1).split("|").map((c) => c.trim()));
      }
      continue;
    }
    fecharTabela();
    const titulo = linha.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      fecharTudo();
      const nivel = Math.min(titulo[1].length + 1, 4);
      out.push(`<h${nivel}>${inline(titulo[2])}</h${nivel}>`);
      continue;
    }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(linha)) {
      fecharTudo();
      out.push("<hr>");
      continue;
    }
    const ul = linha.match(/^\s*[-*•]\s+(.*)$/);
    const ol = linha.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      fecharParagrafo();
      const tipo = ul ? "ul" : "ol";
      if (lista !== tipo) {
        fecharLista();
        out.push(`<${tipo}>`);
        lista = tipo;
      }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
      continue;
    }
    fecharLista();
    paragrafo.push(inline(linha));
  }
  fecharTudo();
  return out.join("");
}
