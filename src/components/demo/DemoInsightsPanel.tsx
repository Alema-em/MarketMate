import {
  AlertTriangle,
  Bot,
  PieChart,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  DEMO_ALLOCATION,
  DEMO_INSIGHTS,
} from "@/lib/demo/seed-data";
import { formatPercent } from "@/lib/finance";

export function DemoInsightsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`glass-card ${compact ? "p-5" : "p-6 sm:p-8"}`}
    >
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Demo portfolio
        </p>
        <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight">
          Portfolio intelligence
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {DEMO_INSIGHTS.summary}
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill
          label="Risk score"
          value={`${DEMO_INSIGHTS.riskScore}/10`}
          sub={DEMO_INSIGHTS.riskLabel}
        />
        <StatPill
          label="Top performer"
          value={DEMO_INSIGHTS.topPerformer.symbol}
          sub={formatPercent(DEMO_INSIGHTS.topPerformer.gainPercent)}
          positive
        />
        <StatPill
          label="Watch"
          value={DEMO_INSIGHTS.laggard.symbol}
          sub={formatPercent(DEMO_INSIGHTS.laggard.gainPercent)}
          positive={false}
        />
        <StatPill label="Positions" value="10" sub="5 stocks · 3 ETFs · 2 crypto" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-surface-elevated/40 p-5">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <PieChart className="h-4 w-4 text-accent" />
            Asset allocation
          </span>
          <ul className="mt-4 space-y-3">
            {DEMO_ALLOCATION.map((slice) => (
              <li key={slice.label}>
                <span className="flex justify-between text-sm">
                  <span className="text-muted">{slice.label}</span>
                  <span className="font-medium">{slice.percent}%</span>
                </span>
                <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-surface">
                  <span
                    className="block h-full rounded-full transition-all"
                    style={{
                      width: `${slice.percent}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-border bg-surface-elevated/40 p-5">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-accent" />
            Rebalance suggestion
          </span>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            {DEMO_INSIGHTS.rebalance}
          </p>
          <span className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            Demo insight — not financial advice. Real accounts get personalized
            analysis in a future release.
          </span>
        </article>
      </div>

      {!compact && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Momentum",
              desc: "Tech & growth ETFs trending above 50-day average",
            },
            {
              icon: Sparkles,
              title: "Dividend yield",
              desc: "Estimated 0.8% blended yield on current weights",
            },
            {
              icon: Bot,
              title: "Ask AI",
              desc: "“How exposed am I to crypto?” — coming soon",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="rounded-xl border border-border bg-surface-elevated/30 p-4"
            >
              <Icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StatPill({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
}) {
  return (
    <div className="border border-white/10 bg-background px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl leading-none">{value}</p>
      <p
        className={`text-xs font-medium ${
          positive === true
            ? "text-gain"
            : positive === false
              ? "text-loss"
              : "text-muted"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
