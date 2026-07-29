import type { LearningProfile, LessonProgressRecord } from "@/types/learning";

const PROFILE_KEY = "marketmate_learning_profile_v1";
const PROGRESS_KEY = "marketmate_learning_progress_v1";

function profileKey(uid: string) {
  return `${PROFILE_KEY}_${uid}`;
}

function progressKey(uid: string) {
  return `${PROGRESS_KEY}_${uid}`;
}

export function readLocalLearningProfile(
  uid: string
): LearningProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(profileKey(uid));
    return raw ? (JSON.parse(raw) as LearningProfile) : null;
  } catch {
    return null;
  }
}

export function writeLocalLearningProfile(
  uid: string,
  profile: LearningProfile
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(profileKey(uid), JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function readLocalLessonProgress(
  uid: string
): LessonProgressRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(progressKey(uid));
    return raw ? (JSON.parse(raw) as LessonProgressRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalLessonProgress(
  uid: string,
  records: LessonProgressRecord[]
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(progressKey(uid), JSON.stringify(records));
  } catch {
    /* ignore */
  }
}
