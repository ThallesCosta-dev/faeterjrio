import { useMemo, useState } from "react";
import { BookOpen, Download, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ementarioAds2018, type EmentarioSubject } from "@/lib/ementarioAds2018";

export default function MatrizEmentas() {
  const [search, setSearch] = useState("");
  const [activePeriod, setActivePeriod] = useState<number | "all">("all");
  const [selected, setSelected] = useState<EmentarioSubject | null>(null);
  const [open, setOpen] = useState(false);

  const periods = useMemo(() => {
    return [...new Set(ementarioAds2018.map((s) => s.period))].sort((a, b) => a - b);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ementarioAds2018.filter((s) => {
      if (activePeriod !== "all" && s.period !== activePeriod) return false;
      if (!term) return true;
      const inName = s.name.toLowerCase().includes(term);
      const inId = s.id.toLowerCase().includes(term);
      const inContent = s.content.toLowerCase().includes(term);
      const inBib = [...s.basic, ...s.comp].some((b) => b.toLowerCase().includes(term));
      return inName || inId || inContent || inBib;
    });
  }, [activePeriod, search]);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Ementário</h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed mb-8">
            Pesquise por disciplina, código, ementa ou bibliografia e encontre rapidamente o
            conteúdo programático integral.
          </p>
          <a
            href="https://drive.google.com/uc?export=download&id=1LI0KL1h7xC646dxxD7IoqnA6x5XbPab0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Baixar Ementário
          </a>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-5xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Pesquisar e filtrar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por disciplina, código, ementa ou bibliografia..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={activePeriod === "all" ? "default" : "secondary"}
                onClick={() => setActivePeriod("all")}
                className={cn(activePeriod === "all" ? "bg-primary hover:bg-primary/90" : "", "rounded-full")}
              >
                Todas
              </Button>
              {periods.map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={activePeriod === p ? "default" : "secondary"}
                  onClick={() => setActivePeriod(p)}
                  className={cn(activePeriod === p ? "bg-primary hover:bg-primary/90" : "", "rounded-full")}
                >
                  {p}º período
                </Button>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              Exibindo {filtered.length} disciplina{filtered.length !== 1 ? "s" : ""}.
            </div>
          </CardContent>
        </Card>

        <div className="max-w-5xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelected(s);
                  setOpen(true);
                }}
                className="text-left"
              >
                <Card className="h-full transition-all hover:shadow-soft-lg hover:-translate-y-1 border-border/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-mono">
                            {s.id}
                          </Badge>
                          <Badge variant="outline">{s.period}º</Badge>
                        </div>
                        <CardTitle className="text-lg text-primary leading-snug whitespace-normal break-words">
                          {s.name}
                        </CardTitle>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {s.hours}h
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {s.pre && (
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="font-semibold text-primary">Pré-requisito: </span>
                        {s.pre}
                      </div>
                    )}
                    <p className="text-sm text-foreground/70 line-clamp-3">
                      {s.content}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {selected?.name || "Disciplina"}
            </DialogTitle>
            <DialogDescription>
              {selected ? `${selected.id} | ${selected.period}º Período | ${selected.hours}h` : null}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-bold text-white">
                  Ementa / Conteúdo Programático
                </div>
                <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap">
                  {selected.content}
                </p>
              </div>

              <div>
                <div className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-bold text-white">
                  Referências Bibliográficas
                </div>

                <div className="mt-3 rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
                  <div>
                    <div className="text-sm font-bold text-primary underline">Básica</div>
                    <ul className="mt-2 space-y-2">
                      {selected.basic.map((b, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 border-l-2 border-border pl-3">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selected.comp.length > 0 && (
                    <div>
                      <div className="text-sm font-bold text-primary underline">Complementar</div>
                      <ul className="mt-2 space-y-2">
                        {selected.comp.map((c, idx) => (
                          <li key={idx} className="text-sm text-foreground/80 border-l-2 border-border pl-3">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{selected.hours} horas/aula</span>
                </div>
                {selected.pre ? <span>Pré-requisito: {selected.pre}</span> : <span />}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
