"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDemoAccount } from "@/hooks/useDemoAccount";
import {
  DEMO_LEARNING_PROFILE,
  DEMO_LESSON_PROGRESS,
} from "@/lib/demo/learning-seed-data";
import {
  readLocalLearningProfile,
  readLocalLessonProgress,
  writeLocalLearningProfile,
  writeLocalLessonProgress,
} from "@/lib/learning/local-storage";
import {
  attachLessonStatuses,
  computePathProgress,
  computeTotalXp,
  isPracticeUnlocked,
} from "@/lib/learning/progress-utils";
import {
  FIRST_INVESTOR_PATH,
  getLessonsForPath,
} from "@/lib/learning/first-investor-lessons";
import {
  saveLearningProfile,
  saveLessonProgress,
  subscribeLearningProfile,
  subscribeLessonProgress,
} from "@/lib/firestore/learning";
import type {
  LearningProfile,
  LessonProgressRecord,
} from "@/types/learning";
import {
  FIRST_INVESTOR_PATH_ID,
  LESSON_XP_BASE,
  LESSON_XP_QUIZ_BONUS,
} from "@/types/learning";
import { getFriendlyFirestoreError } from "@/lib/errors/user-messages";

const DEMO_READ_ONLY_MSG =
  "Demo learning progress is read-only. Sign in with a personal account to save your path.";

export function useLearning() {
  const { user } = useAuth();
  const { isDemo } = useDemoAccount();
  const uid = user?.uid ?? null;

  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [progress, setProgress] = useState<LessonProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setProfile(DEMO_LEARNING_PROFILE);
      setProgress(DEMO_LESSON_PROGRESS);
      setLoading(false);
      setError(null);
      return;
    }

    if (!uid) {
      setProfile(null);
      setProgress([]);
      setLoading(false);
      return;
    }

    setProfile(readLocalLearningProfile(uid));
    setProgress(readLocalLessonProgress(uid));
    setLoading(true);

    const unsubProfile = subscribeLearningProfile(
      uid,
      (remote) => {
        if (remote) {
          setProfile(remote);
          writeLocalLearningProfile(uid, remote);
        }
        setLoading(false);
      },
      () => {
        setError(getFriendlyFirestoreError());
        setLoading(false);
      }
    );

    const unsubProgress = subscribeLessonProgress(
      uid,
      (remote) => {
        setProgress(remote);
        writeLocalLessonProgress(uid, remote);
        setError(null);
      },
      () => setError(getFriendlyFirestoreError())
    );

    return () => {
      unsubProfile();
      unsubProgress();
    };
  }, [uid, isDemo]);

  const lessons = useMemo(
    () => getLessonsForPath(FIRST_INVESTOR_PATH_ID),
    []
  );

  const lessonsWithStatus = useMemo(
    () => attachLessonStatuses(lessons, progress),
    [lessons, progress]
  );

  const pathProgress = useMemo(
    () => computePathProgress(lessons, progress),
    [lessons, progress]
  );

  const totalXp = useMemo(() => computeTotalXp(progress), [progress]);
  const practiceUnlocked = useMemo(
    () => isPracticeUnlocked(progress),
    [progress]
  );

  const needsOnboarding = !loading && !profile?.onboardingCompleted;

  const completeOnboarding = useCallback(
    async (next: LearningProfile) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!uid) throw new Error("You must be signed in");
      setSaving(true);
      try {
        setProfile(next);
        writeLocalLearningProfile(uid, next);
        await saveLearningProfile(uid, next);
      } finally {
        setSaving(false);
      }
    },
    [uid, isDemo]
  );

  const completeLesson = useCallback(
    async (lessonId: string, quizPassed: boolean) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!uid) throw new Error("You must be signed in");

      const existing = progress.find((p) => p.lessonId === lessonId);
      if (existing?.completed) return;

      const xpEarned =
        LESSON_XP_BASE + (quizPassed ? LESSON_XP_QUIZ_BONUS : 0);

      const record: LessonProgressRecord = {
        lessonId,
        pathId: FIRST_INVESTOR_PATH_ID,
        completed: true,
        quizPassed,
        xpEarned,
        completedAt: new Date().toISOString().slice(0, 10),
      };

      setSaving(true);
      try {
        const next = [
          ...progress.filter((p) => p.lessonId !== lessonId),
          record,
        ];
        setProgress(next);
        writeLocalLessonProgress(uid, next);
        await saveLessonProgress(uid, record);
      } finally {
        setSaving(false);
      }
    },
    [uid, isDemo, progress]
  );

  return {
    path: FIRST_INVESTOR_PATH,
    profile,
    progress,
    lessons,
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
    completeLesson,
  };
}
