import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-emerald-500/10 ring-1 ring-border">
        <Icon className="h-8 w-8 text-accent" />
      </span>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && <span className="mt-8">{action}</span>}
    </section>
  );
}
