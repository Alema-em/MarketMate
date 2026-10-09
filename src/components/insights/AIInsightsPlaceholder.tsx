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
    <section className="glass-card p-6 sm:p-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Coming soon
        </p>
        <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight">
          Portfolio insights
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Personalized analysis, risk alerts, and smart rebalancing suggestions
          powered by AI — integrated in a future release.
        </p>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
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
            className="border border-white/10 bg-background p-4"
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
        className="mt-6 w-full cursor-not-allowed border border-dashed border-white/15 px-4 py-3 text-sm text-muted sm:w-auto"
      >
        Enable AI insights (coming soon)
      </button>
    </section>
  );
}
