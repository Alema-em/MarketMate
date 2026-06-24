import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { DisplayCurrency } from "@/types/currency";
import { SUPPORTED_DISPLAY_CURRENCIES } from "@/types/currency";

function userPrefsRef(uid: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  return doc(db, "users", uid, "preferences", "app");
}

function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return (
    typeof value === "string" &&
    (SUPPORTED_DISPLAY_CURRENCIES as readonly string[]).includes(value)
  );
}

export function subscribeDisplayCurrency(
  uid: string,
  onValue: (currency: DisplayCurrency | null) => void,
  onError?: (err: unknown) => void
): () => void {
  const db = getFirebaseDb();
  if (!db) {
    onValue(null);
    return () => {};
  }

  return onSnapshot(
    userPrefsRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onValue(null);
        return;
      }
      const raw = snapshot.data().displayCurrency;
      onValue(isDisplayCurrency(raw) ? raw : null);
    },
    (err) => {
      console.error("Preferences snapshot error:", err);
      onError?.(err);
    }
  );
}

export async function saveDisplayCurrency(
  uid: string,
  currency: DisplayCurrency
): Promise<void> {
  await setDoc(
    userPrefsRef(uid),
    {
      displayCurrency: currency,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
