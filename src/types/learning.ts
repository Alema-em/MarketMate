export const FIRST_INVESTOR_PATH_ID = "first-investor";

export type ExperienceLevel = "brand_new" | "some_knowledge" | "experienced";

export type LearningGoal =
  | "learn_basics"
  | "mock_portfolio"
  | "track_investments";

export interface LessonQuizChoice {
  id: string;
  label: string;
}

export interface LessonQuiz {
  question: string;
  choices: LessonQuizChoice[];
  correctChoiceId: string;
  explanation: string;
}

export interface LessonSection {
  heading: string;
  body: string;
}

export interface LessonContent {
  id: string;
  pathId: string;
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  sections: LessonSection[];
  example: { title: string; body: string };
  quiz: LessonQuiz;
  copilotPrompt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface LessonProgressRecord {
  lessonId: string;
  pathId: string;
  completed: boolean;
  quizPassed: boolean;
  xpEarned: number;
  completedAt?: string;
}

export interface LearningProfile {
  experienceLevel: ExperienceLevel;
  learningGoal: LearningGoal;
  onboardingCompleted: boolean;
  activePathId: string;
}

export type LessonStatus = "locked" | "available" | "completed";

export interface LessonWithStatus extends LessonContent {
  status: LessonStatus;
  progress?: LessonProgressRecord;
}

export const LESSON_XP_BASE = 15;
export const LESSON_XP_QUIZ_BONUS = 5;
export const PRACTICE_UNLOCK_LESSON_ID = "diversification";
