import type { ReactNode } from "react";

type LearnZone = "learn" | "practice" | "portfolio";

const styles: Record<
  LearnZone,
  { label: string; className: string }
> = {
  learn: {
    label: "Learn",
    className: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  },
  practice: {
    label: "Practice",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  },
  portfolio: {
    label: "My Portfolio",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
};

export function LearnZoneBadge({ zone }: { zone: LearnZone }) {
  const { label, className } = styles[zone];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

export function LearnZoneNote({
  zone,
  children,
}: {
  zone: LearnZone;
  children: ReactNode;
}) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <LearnZoneBadge zone={zone} />
      <span>{children}</span>
    </p>
  );
}
