import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { PortfolioHoldingInput } from "@/types/stocks";

export function portfolioCollection(uid: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  return collection(db, "users", uid, "portfolio");
}

export async function createHolding(
  uid: string,
  input: PortfolioHoldingInput
): Promise<string> {
  const ref = await addDoc(portfolioCollection(uid), {
    symbol: input.symbol.toUpperCase(),
    name: input.name ?? input.symbol.toUpperCase(),
    shares: input.shares,
    avgCost: input.avgCost,
    purchaseDate: input.purchaseDate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateHolding(
  uid: string,
  holdingId: string,
  input: PortfolioHoldingInput
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  await updateDoc(doc(db, "users", uid, "portfolio", holdingId), {
    symbol: input.symbol.toUpperCase(),
    name: input.name ?? input.symbol.toUpperCase(),
    shares: input.shares,
    avgCost: input.avgCost,
    purchaseDate: input.purchaseDate,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteHolding(
  uid: string,
  holdingId: string
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not configured");
  await deleteDoc(doc(db, "users", uid, "portfolio", holdingId));
}

export function timestampToIso(
  value: Timestamp | string | undefined
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toDate().toISOString().slice(0, 10);
}
