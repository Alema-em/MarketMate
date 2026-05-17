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
  icon: Icon,
}: StatCardProps) {
  const trendClass =
    trend === "gain"
      ? "text-gain"
      : trend === "loss"
        ? "text-loss"
        : "text-muted";

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {subValue && (
            <p className={`mt-1 text-sm font-medium ${trendClass}`}>
              {subValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
