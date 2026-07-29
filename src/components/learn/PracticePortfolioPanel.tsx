import Link from "next/link";
import { FlaskConical, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LearnZoneBadge, LearnZoneNote } from "@/components/learn/LearnZoneBadge";

interface PracticePortfolioPanelProps {
  unlocked: boolean;
}

export function PracticePortfolioPanel({ unlocked }: PracticePortfolioPanelProps) {
  if (!unlocked) {
    return (
      <section className="glass-card border-dashed border-amber-500/20 p-5 sm:p-6 opacity-80">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 shrink-0 text-amber-200 mt-0.5" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <LearnZoneBadge zone="practice" />
              <span className="text-xs text-muted">Locked</span>
            </div>
            <h2 className="mt-2 font-semibold">Practice Portfolio</h2>
            <p className="mt-1 text-sm text-muted">
              Complete the Diversification lesson to unlock a safe sandbox for
              mock holdings — separate from My Portfolio.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card border border-amber-500/25 bg-amber-500/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <LearnZoneNote zone="practice">
            Sandbox only — not connected to real money or My Portfolio.
          </LearnZoneNote>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-amber-200" />
            Practice Portfolio
          </h2>
          <p className="text-sm text-muted max-w-xl">
            v1 exercise space: try allocation ideas with imaginary positions.
            Your real holdings stay under{" "}
            <strong className="text-foreground font-medium">My Portfolio</strong>.
          </p>
        </div>
        <Link href="/learn/practice" className="shrink-0">
          <Button variant="secondary">Open practice</Button>
        </Link>
      </div>
    </section>
  );
}
