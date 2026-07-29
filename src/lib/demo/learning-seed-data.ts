import type { LearningProfile, LessonProgressRecord } from "@/types/learning";
import { FIRST_INVESTOR_PATH_ID } from "@/types/learning";

export const DEMO_LEARNING_PROFILE: LearningProfile = {
  experienceLevel: "brand_new",
  learningGoal: "learn_basics",
  onboardingCompleted: true,
  activePathId: FIRST_INVESTOR_PATH_ID,
};

export const DEMO_LESSON_PROGRESS: LessonProgressRecord[] = [
  {
    lessonId: "why-invest",
    pathId: FIRST_INVESTOR_PATH_ID,
    completed: true,
    quizPassed: true,
    xpEarned: 20,
    completedAt: "2025-01-15",
  },
  {
    lessonId: "what-is-stock",
    pathId: FIRST_INVESTOR_PATH_ID,
    completed: true,
    quizPassed: true,
    xpEarned: 20,
    completedAt: "2025-01-16",
  },
  {
    lessonId: "what-is-etf",
    pathId: FIRST_INVESTOR_PATH_ID,
    completed: true,
    quizPassed: true,
    xpEarned: 20,
    completedAt: "2025-01-17",
  },
];
