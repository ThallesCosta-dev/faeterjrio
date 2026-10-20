import { useState, useCallback } from "react";
import { Upload, FileText, Check, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { parseHorarioPdf, type ParsedHorario, type ParsedAula } from "@/lib/parseHorarioPdf";

type Step = "upload" | "parsing" | "preview" | "saving" | "done" | "error";

const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"] as const;

export default function AdminHorarios() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedHorario | null>(null);
  const [error, setError] = useState("");
  const [currentData, setCurrentData] = useState<{
    periodo_letivo: string;
    updated_at: string;
  } | null>(null);

  // Load current data on mount
  useState(() => {
    supabase
      .from("horarios")
      .select("periodo_letivo, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setCurrentData(data[0]);
      });
  });

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Por favor, selecione um arquivo PDF.");
      setStep("error");
      return;
    }

    setFile(f);
    setStep("parsing");
    setError("");

    try {
      const result = await parseHorarioPdf(f);
      if (!result.turmas.length) {
        throw new Error(
          "Nenhuma turma encontrada no PDF. Verifique se é o arquivo correto do Coruja."
        );
      }
      setParsed(result);
      setStep("preview");
    } catch (e: any) {
      setError(e.message || "Erro ao processar o PDF.");
      setStep("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleSave = useCallback(async () => {
    if (!parsed || !file) return;
    setStep("saving");

    try {
      // Deactivate previous active records
      await supabase
        .from("horarios")
        .update({ is_active: false })
        .eq("is_active", true);

      // Upload PDF to storage
      const pdfPath = `horarios/${Date.now()}_${file.name}`;
      await supabase.storage.from("cms-pdfs").upload(pdfPath, file);

      // Insert new record
      const { error: insertError } = await supabase.from("horarios").insert({
        periodo_letivo: parsed.periodoLetivo,
        curso: parsed.curso,
        data: parsed,
        pdf_name: file.name,
        pdf_path: pdfPath,
        is_active: true,
      });

      if (insertError) throw insertError;
      setStep("done");
    } catch (e: any) {
      setError(e.message || "Erro ao salvar no banco de dados.");
      setStep("error");
    }
  }, [parsed, file]);

  const reset = () => {
    setFile(null);
    setParsed(null);
    setError("");
    setStep("upload");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Atualizar Horários
        </h1>
        <p className="text-muted-foreground mt-1">
          Faça upload do PDF de horários gerado pelo Coruja para atualizar
          automaticamente a grade no site.
        </p>
      </div>

      {currentData && step === "upload" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Check className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Período ativo: {currentData.periodo_letivo}
              </p>
              <p className="text-xs text-muted-foreground">
                Última atualização:{" "}
                {new Date(currentData.updated_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload */}
      {step === "upload" && (
        <Card>
          <CardContent className="py-8">
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf";
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (f) handleFile(f);
                };
                input.click();
              }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Arraste o PDF aqui ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                Arquivo PDF gerado pelo sistema Coruja (ex: Horário- 2026-2.pdf)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsing */}
      {step === "parsing" && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg font-medium">Processando PDF...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Extraindo horários de {file?.name}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {step === "error" && (
        <Card className="border-destructive/30">
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium text-destructive mb-2">
              Erro ao processar
            </p>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={reset} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {step === "preview" && parsed && (
        <>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center justify-between gap-4 py-4 flex-wrap">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsed.curso} · Período Letivo: {parsed.periodoLetivo} ·{" "}
                    {parsed.turmas.length} turmas encontradas
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={reset}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar e Publicar
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Confira abaixo os horários extraídos do PDF. Clique em "Confirmar e
            Publicar" para atualizar o site.
          </p>

          {parsed.turmas.map((turma, ti) => (
            <Card key={ti} className="overflow-hidden">
              <CardHeader className="py-3 bg-secondary/40">
                <CardTitle className="text-sm text-primary">
                  {turma.turno} - {turma.periodo} - {turma.turma}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="min-w-[800px] w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-border bg-secondary/30 p-2 text-xs font-bold text-center w-20">
                          Tempo
                        </th>
                        {DIAS.map((d) => (
                          <th
                            key={d}
                            className="border border-border bg-secondary/30 p-2 text-xs font-bold text-center"
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {turma.slots.map((slot) => (
                        <tr key={slot.tempo}>
                          <td className="border border-border p-2 text-center">
                            <div className="text-xs font-bold text-primary">
                              {slot.tempo}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {slot.hora}
                            </div>
                          </td>
                          {DIAS.map((dia) => {
                            const aula = turma.grid[slot.tempo]?.[dia] as
                              | ParsedAula
                              | undefined;
                            return (
                              <td
                                key={dia}
                                className="border border-border p-2"
                              >
                                {aula ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-extrabold text-primary">
                                      {aula.disciplina}
                                    </span>
                                    <span className="text-[10px] text-foreground/80">
                                      {aula.professor}
                                    </span>
                                    <span className="text-[10px] text-foreground/50">
                                      {aula.modalidade}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-foreground/20">
                                    &nbsp;
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Saving */}
      {step === "saving" && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg font-medium">Salvando horários...</p>
          </CardContent>
        </Card>
      )}

      {/* Done */}
      {step === "done" && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="py-8 text-center">
            <Check className="w-10 h-10 mx-auto mb-4 text-green-600" />
            <p className="text-lg font-bold text-green-800 mb-2">
              Horários atualizados!
            </p>
            <p className="text-sm text-green-700 mb-6">
              O período {parsed?.periodoLetivo} já está publicado no site.
            </p>
            <Button onClick={reset} variant="outline">
              Enviar outro arquivo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
