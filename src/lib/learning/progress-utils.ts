import type {
  LessonContent,
  LessonProgressRecord,
  LessonStatus,
  LessonWithStatus,
} from "@/types/learning";
import { PRACTICE_UNLOCK_LESSON_ID } from "@/types/learning";

export function getProgressMap(
  records: LessonProgressRecord[]
): Map<string, LessonProgressRecord> {
  return new Map(records.map((r) => [r.lessonId, r]));
}

export function isLessonCompleted(
  lessonId: string,
  records: LessonProgressRecord[]
): boolean {
  return records.some((r) => r.lessonId === lessonId && r.completed);
}

export function getLessonStatus(
  lesson: LessonContent,
  lessons: LessonContent[],
  records: LessonProgressRecord[]
): LessonStatus {
  const progress = getProgressMap(records).get(lesson.id);
  if (progress?.completed) return "completed";

  const index = lessons.findIndex((l) => l.id === lesson.id);
  if (index <= 0) return "available";

  const prev = lessons[index - 1];
  if (isLessonCompleted(prev.id, records)) return "available";
  return "locked";
}

export function attachLessonStatuses(
  lessons: LessonContent[],
  records: LessonProgressRecord[]
): LessonWithStatus[] {
  const map = getProgressMap(records);
  return lessons.map((lesson) => ({
    ...lesson,
    status: getLessonStatus(lesson, lessons, records),
    progress: map.get(lesson.id),
  }));
}

export function computeTotalXp(records: LessonProgressRecord[]): number {
  return records.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
}

export function computePathProgress(
  lessons: LessonContent[],
  records: LessonProgressRecord[]
): { completed: number; total: number; percent: number } {
  const total = lessons.length;
  const completed = lessons.filter((l) =>
    isLessonCompleted(l.id, records)
  ).length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function isPracticeUnlocked(records: LessonProgressRecord[]): boolean {
  return isLessonCompleted(PRACTICE_UNLOCK_LESSON_ID, records);
}
