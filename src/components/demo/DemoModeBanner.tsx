import { Presentation, Sparkles } from "lucide-react";
import { getDemoAccountLabel } from "@/lib/demo/config";

export function DemoModeBanner() {
  return (
    <aside
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/25 bg-gradient-to-r from-accent/15 via-violet-500/10 to-emerald-500/10 px-4 py-3 text-sm"
      role="status"
    >
      <span className="flex items-center gap-2 text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
          <Presentation className="h-4 w-4 text-accent" />
        </span>
        <span>
          <span className="font-semibold">{getDemoAccountLabel()}</span>
          <span className="mt-0.5 block text-xs text-muted">
            Curated sample portfolio · Live prices when available · Changes are
            not saved
          </span>
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        Demo data
      </span>
    </aside>
  );
}
