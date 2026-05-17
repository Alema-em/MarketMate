import { Bot, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface AIInsightsPlaceholderProps {
  isEmpty?: boolean;
  onAddInvestment?: () => void;
}

export function AIInsightsPlaceholder({
  isEmpty = false,
  onAddInvestment,
}: AIInsightsPlaceholderProps) {
  if (isEmpty) {
    return (
      <EmptyState
        icon={Bot}
        title="AI insights unlock with your portfolio"
        description="Add your first investment to unlock personalized analysis, risk alerts, and smart summaries — coming soon."
        action={
          onAddInvestment ? (
            <Button onClick={onAddInvestment}>Add Your First Investment</Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <section className="glass-card relative overflow-hidden p-6 sm:p-8">
      <span
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden
      />

      <header className="relative flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 shadow-lg shadow-accent/25">
          <Bot className="h-6 w-6 text-white" />
        </span>
        <span>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Coming soon
          </span>
          <h2 className="mt-2 text-xl font-semibold">AI Portfolio Insights</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Personalized analysis, risk alerts, and smart rebalancing suggestions
            powered by AI — integrated in a future release.
          </p>
        </span>
      </header>

      <ul className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Smart summaries",
            desc: "Daily digest of your portfolio performance",
          },
          {
            icon: Zap,
            title: "Risk alerts",
            desc: "Notifications when volatility spikes",
          },
          {
            icon: Bot,
            title: "Ask anything",
            desc: "Chat about holdings and market trends",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="rounded-xl border border-border bg-surface-elevated/40 p-4"
          >
            <Icon className="h-5 w-5 text-accent" />
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs text-muted">{desc}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled
        className="relative mt-6 w-full cursor-not-allowed rounded-xl border border-dashed border-border bg-white/5 px-4 py-3 text-sm font-medium text-muted sm:w-auto"
      >
        Enable AI insights (coming soon)
      </button>
    </section>
  );
}
