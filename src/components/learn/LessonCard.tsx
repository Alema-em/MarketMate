"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { LessonWithStatus } from "@/types/learning";

interface LessonCardProps {
  lesson: LessonWithStatus;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const locked = lesson.status === "locked";
  const completed = lesson.status === "completed";

  const inner = (
    <article
      className={`glass-card-hover flex items-start gap-4 p-4 sm:p-5 transition-opacity ${
        locked ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${
          completed
            ? "bg-gain-muted text-gain ring-gain/20"
            : locked
              ? "bg-surface-elevated text-muted ring-border"
              : "bg-accent/15 text-accent ring-accent/20"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5" aria-hidden />
        ) : locked ? (
          <Lock className="h-5 w-5" aria-hidden />
        ) : (
          <PlayCircle className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">
          Lesson {lesson.order} · ~{lesson.durationMinutes} min
        </p>
        <h3 className="mt-0.5 font-semibold text-foreground">{lesson.title}</h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{lesson.subtitle}</p>
        {lesson.progress?.xpEarned ? (
          <p className="mt-2 text-xs font-medium text-accent">
            +{lesson.progress.xpEarned} XP earned
          </p>
        ) : null}
      </span>
      {!locked && (
        <span className="shrink-0 text-xs font-medium text-accent self-center">
          {completed ? "Review" : "Start"}
        </span>
      )}
    </article>
  );

  if (locked) {
    return <div aria-disabled>{inner}</div>;
  }

  return (
    <Link href={`/learn/lesson/${lesson.id}`} className="block">
      {inner}
    </Link>
  );
}
