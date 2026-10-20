import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "aberto" | "fechado" }) {
  return (
    <span
      className={cn(
        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide",
        status === "aberto" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600",
      )}
    >
      {status === "aberto" ? "Aberto" : "Encerrado"}
    </span>
  );
}
