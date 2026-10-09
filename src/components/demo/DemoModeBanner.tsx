import { Presentation } from "lucide-react";
import { getDemoAccountLabel } from "@/lib/demo/config";

export function DemoModeBanner() {
  return (
    <aside
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
      role="status"
    >
      <span className="flex items-center gap-2 text-foreground">
        <span className="mark h-8 w-8">
          <Presentation className="h-4 w-4" />
        </span>
        <span>
          <span className="font-semibold">{getDemoAccountLabel()}</span>
          <span className="mt-0.5 block text-xs text-muted">
            Curated sample portfolio · Live prices when available · Changes are
            not saved
          </span>
        </span>
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Demo data
      </span>
    </aside>
  );
}
