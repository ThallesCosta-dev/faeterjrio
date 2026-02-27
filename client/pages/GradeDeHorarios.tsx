import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { turmasTasi2026_1, diasSemana, TurmaHorario } from "@/lib/tasiHorario2026_1";

const formatTurmaTitle = (t: TurmaHorario) =>
  `${t.turno} - ${t.periodo} - ${t.turma}`;

export default function GradeDeHorarios() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-28 pb-10 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Grade de Horários • TASI • 2026.1
          </h1>
          <p className="text-white/80 mt-2 max-w-3xl">
            Informações organizadas a partir da grade emitida no Coruja.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 space-y-6">
          {turmasTasi2026_1.map((turma) => (
            <Card key={turma.id} className="border-border">
              <CardHeader>
                <CardTitle className="text-primary">
                  {turma.curso} • {turma.periodoLetivo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="min-w-[900px] w-full border-collapse border border-border">
                    <thead>
                      <tr>
                        <th
                          className="border border-border bg-secondary/40 p-2 text-xs font-bold text-primary text-center"
                        >
                          
                        </th>
                        <th
                          colSpan={diasSemana.length}
                          className="border border-border bg-secondary/40 p-2 text-xs font-bold text-primary text-center"
                        >
                          {formatTurmaTitle(turma)}
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-border bg-secondary/30 p-2 text-[11px] font-bold text-foreground/80 text-center">
                          Tempo
                        </th>
                        {diasSemana.map((dia) => (
                          <th
                            key={dia}
                            className="border border-border bg-secondary/30 p-2 text-[11px] font-bold text-foreground/80 text-center"
                          >
                            {dia}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {turma.slots.map((slot) => (
                        <tr key={slot.tempo} className="align-top">
                          <td className="border border-border p-2 whitespace-nowrap">
                            <div className="text-xs font-bold text-primary text-center">
                              {slot.tempo}
                            </div>
                            <div className="text-[10px] text-foreground/60 text-center">
                              {slot.hora}
                            </div>
                          </td>
                          {diasSemana.map((dia) => {
                            const aula = turma.grid[slot.tempo]?.[dia];
                            if (!aula) {
                              return (
                                <td key={dia} className="border border-border p-2">
                                  <div className="text-xs text-foreground/30 text-center">&nbsp;</div>
                                </td>
                              );
                            }

                            return (
                              <td key={dia} className="border border-border p-2">
                                <div className="flex flex-col gap-0.5">
                                  <div className="text-[11px] font-extrabold text-primary">
                                    {aula.disciplina}
                                  </div>
                                  <div className="text-[10px] text-foreground/80 leading-tight">
                                    {aula.professor}
                                  </div>
                                  <div className="text-[10px] text-foreground/50 leading-tight">
                                    {aula.modalidade}
                                  </div>
                                </div>
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

          <div className="text-center pt-4">
            <p className="text-xs text-foreground/40">
              * Caso haja divergência, considere sempre o documento oficial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
