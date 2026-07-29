"use client";

import { use, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LessonViewer } from "@/components/learn/LessonViewer";
import {
  getLessonById,
  getLessonsForPath,
} from "@/lib/learning/first-investor-lessons";
import { getLessonStatus } from "@/lib/learning/progress-utils";
import { useLearning } from "@/hooks/useLearning";
import { FIRST_INVESTOR_PATH_ID } from "@/types/learning";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const lesson = getLessonById(id);
  const {
    progress,
    loading,
    needsOnboarding,
    saving,
    completeLesson,
  } = useLearning();

  const lessons = getLessonsForPath(FIRST_INVESTOR_PATH_ID);
  const status = lesson
    ? getLessonStatus(lesson, lessons, progress)
    : "locked";
  const completed = progress.some((p) => p.lessonId === id && p.completed);

  useEffect(() => {
    if (!loading && needsOnboarding) {
      router.replace("/learn");
    } else if (!loading && lesson && status === "locked") {
      router.replace("/learn");
    }
  }, [loading, needsOnboarding, lesson, status, router]);

  if (!lesson) {
    notFound();
  }

  if (loading || needsOnboarding || status === "locked") {
    return (
      <AppShell title="Lesson">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={lesson.title}>
      <LessonViewer
        lesson={lesson}
        completed={completed}
        saving={saving}
        onComplete={(quizPassed) => completeLesson(id, quizPassed)}
      />
    </AppShell>
  );
}
