import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export function watchlistCollection(uid: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  return collection(db, "users", uid, "watchlist");
}

export async function addWatchlistSymbol(
  uid: string,
  symbol: string,
  name?: string
): Promise<string> {
  const ref = await addDoc(watchlistCollection(uid), {
    symbol: symbol.toUpperCase(),
    name: name ?? symbol.toUpperCase(),
    addedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function removeWatchlistItem(
  uid: string,
  itemId: string
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  await deleteDoc(doc(db, "users", uid, "watchlist", itemId));
}
