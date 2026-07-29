"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { LearnZoneBadge } from "@/components/learn/LearnZoneBadge";
import { useLearning } from "@/hooks/useLearning";

export default function PracticePortfolioPage() {
  const router = useRouter();
  const { practiceUnlocked, loading } = useLearning();

  useEffect(() => {
    if (!loading && !practiceUnlocked) {
      router.replace("/learn");
    }
  }, [loading, practiceUnlocked, router]);

  if (loading || !practiceUnlocked) {
    return (
      <AppShell title="Practice Portfolio">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Practice Portfolio">
      <span className="mx-auto max-w-2xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/learn")}
          className="-ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Learn
        </Button>

        <header className="glass-card border border-amber-500/25 bg-amber-500/5 p-6 sm:p-8 text-center space-y-4">
          <LearnZoneBadge zone="practice" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/30">
            <FlaskConical className="h-7 w-7 text-amber-200" />
          </div>
          <h1 className="text-2xl font-bold">Practice Portfolio</h1>
          <p className="text-sm text-muted leading-relaxed">
            v1 sandbox — build imaginary allocations here without affecting{" "}
            <strong className="text-foreground font-medium">My Portfolio</strong>.
            Full interactive exercises are coming soon.
          </p>
        </header>

        <section className="glass-card p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold">First exercise (preview)</h2>
          <p className="text-sm text-muted">
            Imagine you have $1,000 in play money. How might you split it across
            a broad ETF and one individual stock? Write your split on paper, then
            discuss trade-offs with MarketMate AI — no real trades involved.
          </p>
          <ul className="text-sm text-muted space-y-2 list-disc pl-5">
            <li>60% broad market ETF (diversification)</li>
            <li>30% sector or theme you understand</li>
            <li>10% cash for learning buffer</li>
          </ul>
          <p className="text-xs text-muted border-t border-border pt-4">
            This is educational only. Practice holdings will not sync to live
            prices or Firestore in v1.
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/copilot?prompt=Help%20me%20think%20through%20a%20mock%20%241%2C000%20practice%20portfolio%20allocation%20for%20learning%20only.%20No%20buy%20recommendations.">
            <Button variant="secondary" className="w-full sm:w-auto">
              Discuss with AI
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="ghost" className="w-full sm:w-auto">
              My Portfolio (real holdings)
            </Button>
          </Link>
        </div>
      </span>
    </AppShell>
  );
}
