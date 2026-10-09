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
    <section className="glass-card px-6 py-14 text-center">
      <span className="mark mx-auto h-10 w-10 text-muted">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-5 font-serif text-3xl leading-none tracking-[-0.03em]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
      {action && <span className="mt-8 block">{action}</span>}
    </section>
  );
}
