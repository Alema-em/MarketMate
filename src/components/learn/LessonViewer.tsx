"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LessonQuizCard } from "@/components/learn/LessonQuizCard";
import { LearnZoneBadge } from "@/components/learn/LearnZoneBadge";
import type { LessonContent } from "@/types/learning";

interface LessonViewerProps {
  lesson: LessonContent;
  completed: boolean;
  saving?: boolean;
  onComplete: (quizPassed: boolean) => Promise<void>;
}

export function LessonViewer({
  lesson,
  completed,
  saving,
  onComplete,
}: LessonViewerProps) {
  const router = useRouter();
  const [quizDone, setQuizDone] = useState(completed);
  const [finishing, setFinishing] = useState(false);

  const copilotHref = `/copilot?prompt=${encodeURIComponent(lesson.copilotPrompt)}`;

  const handleQuizAnswered = async (passed: boolean) => {
    setQuizDone(true);
    if (!completed) {
      setFinishing(true);
      try {
        await onComplete(passed);
      } finally {
        setFinishing(false);
      }
    }
  };

  return (
    <span className="space-y-6">
      <header className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/learn")}
          className="-ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to path
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <LearnZoneBadge zone="learn" />
          <span className="text-xs text-muted">
            Lesson {lesson.order} · ~{lesson.durationMinutes} min read
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="text-muted max-w-2xl">{lesson.subtitle}</p>
      </header>

      <article className="glass-card space-y-6 p-5 sm:p-8 max-w-3xl">
        {lesson.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-foreground">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {section.body}
            </p>
          </section>
        ))}

        <aside className="rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-accent">
            {lesson.example.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {lesson.example.body}
          </p>
        </aside>

        <p className="text-xs text-muted border-t border-border pt-4">
          Educational content only — not financial advice. MarketMate does not
          recommend buying or selling any security.
        </p>
      </article>

      <LessonQuizCard
        quiz={lesson.quiz}
        onAnswered={(passed) => void handleQuizAnswered(passed)}
        disabled={saving || finishing}
      />

      <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
        <Link href={copilotHref}>
          <Button variant="secondary" className="w-full sm:w-auto">
            <Bot className="h-4 w-4" />
            Ask MarketMate
          </Button>
        </Link>
        {quizDone && (
          <Button
            onClick={() => router.push("/learn")}
            loading={finishing}
            className="w-full sm:w-auto"
          >
            {completed ? "Back to path" : "Continue learning"}
          </Button>
        )}
      </footer>
    </span>
  );
}
