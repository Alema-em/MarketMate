import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type {
  ExperienceLevel,
  LearningGoal,
  LearningProfile,
  LessonProgressRecord,
} from "@/types/learning";
import { FIRST_INVESTOR_PATH_ID } from "@/types/learning";

function learningProfileRef(uid: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  return doc(db, "users", uid, "learningProfile", "app");
}

function lessonProgressCollection(uid: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  return collection(db, "users", uid, "lessonProgress");
}

function mapProgressDoc(
  id: string,
  data: DocumentData
): LessonProgressRecord {
  return {
    lessonId: (data.lessonId as string) ?? id,
    pathId: (data.pathId as string) ?? FIRST_INVESTOR_PATH_ID,
    completed: Boolean(data.completed),
    quizPassed: Boolean(data.quizPassed),
    xpEarned: Number(data.xpEarned) || 0,
    completedAt:
      typeof data.completedAt === "string" ? data.completedAt : undefined,
  };
}

export function subscribeLearningProfile(
  uid: string,
  onValue: (profile: LearningProfile | null) => void,
  onError?: (err: unknown) => void
): () => void {
  const db = getFirebaseDb();
  if (!db) {
    onValue(null);
    return () => {};
  }

  return onSnapshot(
    learningProfileRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(null);
        return;
      }
      const data = snapshot.data();
      onValue({
        experienceLevel: data.experienceLevel as ExperienceLevel,
        learningGoal: data.learningGoal as LearningGoal,
        onboardingCompleted: Boolean(data.onboardingCompleted),
        activePathId:
          (data.activePathId as string) ?? FIRST_INVESTOR_PATH_ID,
      });
    },
    (err) => {
      console.error("Learning profile snapshot error:", err);
      onError?.(err);
    }
  );
}

export function subscribeLessonProgress(
  uid: string,
  onValue: (records: LessonProgressRecord[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const db = getFirebaseDb();
  if (!db) {
    onValue([]);
    return () => {};
  }

  return onSnapshot(
    lessonProgressCollection(uid),
    (snapshot) => {
      onValue(
        snapshot.docs.map((d) => mapProgressDoc(d.id, d.data()))
      );
    },
    (err) => {
      console.error("Lesson progress snapshot error:", err);
      onError?.(err);
    }
  );
}

export async function saveLearningProfile(
  uid: string,
  profile: LearningProfile
): Promise<void> {
  await setDoc(
    learningProfileRef(uid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveLessonProgress(
  uid: string,
  record: LessonProgressRecord
): Promise<void> {
  await setDoc(
    doc(lessonProgressCollection(uid), record.lessonId),
    {
      ...record,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
