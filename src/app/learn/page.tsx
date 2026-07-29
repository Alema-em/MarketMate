"use client";

import Link from "next/link";
import { GraduationCap, Briefcase } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LearningOnboarding } from "@/components/learn/LearningOnboarding";
import { LearningProgressBar } from "@/components/learn/LearningProgressBar";
import { LessonCard } from "@/components/learn/LessonCard";
import { PracticePortfolioPanel } from "@/components/learn/PracticePortfolioPanel";
import { LearnZoneNote } from "@/components/learn/LearnZoneBadge";
import { useLearning } from "@/hooks/useLearning";

export default function LearnPage() {
  const {
    path,
    lessonsWithStatus,
    pathProgress,
    totalXp,
    practiceUnlocked,
    needsOnboarding,
    loading,
    error,
    saving,
    isDemo,
    completeOnboarding,
    profile,
  } = useLearning();

  if (loading) {
    return (
      <AppShell title="Learn">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </AppShell>
    );
  }

  if (needsOnboarding) {
    return (
      <AppShell title="Learn">
        <LearningOnboarding
          saving={saving}
          onComplete={completeOnboarding}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Learn">
      <span className="space-y-8">
        {error && (
          <p className="rounded-xl border border-loss/30 bg-loss-muted px-4 py-3 text-sm text-loss">
            {error}
          </p>
        )}

        <header className="glass-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-violet-300" />
                <LearnZoneNote zone="learn">
                  Educational path — separate from My Portfolio
                </LearnZoneNote>
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">{path.title}</h2>
              <p className="text-sm text-muted max-w-2xl">{path.description}</p>
              {profile?.experienceLevel === "brand_new" && (
                <p className="text-sm text-accent">
                  You chose the beginner path — take lessons in order at your own pace.
                </p>
              )}
            </span>
            {isDemo && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
                Demo progress (read-only)
              </span>
            )}
          </div>
          <LearningProgressBar
            completed={pathProgress.completed}
            total={pathProgress.total}
            percent={pathProgress.percent}
            xp={totalXp}
          />
        </header>

        <PracticePortfolioPanel unlocked={practiceUnlocked} />

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Lessons</h3>
          <div className="grid gap-3">
            {lessonsWithStatus.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-border bg-surface/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted flex items-center gap-2">
            <Briefcase className="h-4 w-4 shrink-0" />
            Ready to track real holdings? That&apos;s{" "}
            <strong className="text-foreground font-medium">My Portfolio</strong> — a separate area.
          </p>
          <Link
            href="/portfolio"
            className="text-sm font-medium text-accent hover:underline shrink-0"
          >
            Go to My Portfolio
          </Link>
        </aside>
      </span>
    </AppShell>
  );
}
