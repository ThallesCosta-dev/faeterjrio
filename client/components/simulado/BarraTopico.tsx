import { cn } from "@/lib/utils";

export function BarraTopico({
  rotulo,
  acertos,
  total,
  detalhe,
}: {
  rotulo: string;
  acertos: number;
  total: number;
  detalhe?: string;
}) {
  const p = total > 0 ? Math.round((acertos / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 gap-2">
        <span className="truncate">{rotulo}</span>
        <span className="text-muted-foreground tabular-nums shrink-0">{detalhe ?? `${acertos}/${total}`} · {p}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", p >= 60 ? "bg-green-500" : p >= 40 ? "bg-amber-500" : "bg-red-500")}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}
