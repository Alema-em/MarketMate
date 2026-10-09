import { getDemoAccountLabel } from "@/lib/demo/config";

export function DemoModeBanner() {
  return (
    <aside
      className="flex flex-wrap items-baseline justify-between gap-3 border border-white/10 bg-surface px-4 py-3 text-sm"
      role="status"
    >
      <p>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Demo
        </span>
        <span className="ml-3 font-medium">{getDemoAccountLabel()}</span>
      </p>
      <p className="text-xs text-muted">
        Sample portfolio. Live prices when available. Changes are not saved.
      </p>
    </aside>
  );
}
