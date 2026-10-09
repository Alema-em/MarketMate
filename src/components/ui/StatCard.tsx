import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "gain" | "loss" | "neutral";
  icon?: LucideIcon;
}

export function StatCard({
  label,
  value,
  subValue,
  trend = "neutral",
}: StatCardProps) {
  const trendClass =
    trend === "gain"
      ? "text-gain"
      : trend === "loss"
        ? "text-loss"
        : "text-muted";

  return (
    <div className="glass-card px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-[1.75rem] leading-none tracking-tight text-foreground">
        {value}
      </p>
      {subValue && (
        <p className={`mt-2 text-sm ${trendClass}`}>{subValue}</p>
      )}
    </div>
  );
}
