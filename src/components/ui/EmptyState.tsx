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
      <span className="flex h-10 w-10 items-center justify-center border border-white/15 text-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="mt-5 font-serif text-3xl font-normal tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action && <span className="mt-8">{action}</span>}
    </section>
  );
}
