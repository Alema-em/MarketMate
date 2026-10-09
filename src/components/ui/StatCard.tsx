interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "gain" | "loss" | "neutral";
  icon?: unknown;
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
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-3 font-mono text-[1.65rem] leading-none font-medium tracking-[-0.03em] text-foreground tabular-nums">
        {value}
      </p>
      {subValue && (
        <p className={`mt-2 text-sm tabular-nums ${trendClass}`}>{subValue}</p>
      )}
    </div>
  );
}
