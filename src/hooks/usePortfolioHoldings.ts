"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useDemoAccount } from "@/hooks/useDemoAccount";
import { DEMO_PORTFOLIO_HOLDINGS } from "@/lib/demo/seed-data";
import {
  createHolding,
  deleteHolding,
  timestampToIso,
  updateHolding,
} from "@/lib/firestore/portfolio";
import { getFriendlyFirestoreError } from "@/lib/errors/user-messages";
import type { PortfolioHolding, PortfolioHoldingInput } from "@/types/stocks";

const DEMO_READ_ONLY_MSG =
  "Demo accounts use curated sample data. Sign in with a personal account to manage your portfolio.";

function mapDocToHolding(id: string, data: DocumentData): PortfolioHolding {
  return {
    id,
    symbol: (data.symbol ?? "").toUpperCase(),
    name: data.name,
    shares: Number(data.shares) || 0,
    avgCost: Number(data.avgCost) || 0,
    purchaseDate:
      timestampToIso(data.purchaseDate) ??
      new Date().toISOString().slice(0, 10),
  };
}

export function usePortfolioHoldings() {
  const { user } = useAuth();
  const { isDemo } = useDemoAccount();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setHoldings(DEMO_PORTFOLIO_HOLDINGS);
      setLoading(false);
      setError(null);
      return;
    }

    const db = getFirebaseDb();
    if (!db || !user) {
      setHoldings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const holdingsRef = collection(db, "users", user.uid, "portfolio");
    const q = query(holdingsRef, orderBy("symbol"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setHoldings(
          snapshot.docs.map((doc) => mapDocToHolding(doc.id, doc.data()))
        );
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Portfolio snapshot error:", err);
        setError(getFriendlyFirestoreError());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isDemo]);

  const addHolding = useCallback(
    async (input: PortfolioHoldingInput) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!user) throw new Error("You must be signed in");
      setSaving(true);
      try {
        await createHolding(user.uid, input);
      } finally {
        setSaving(false);
      }
    },
    [user, isDemo]
  );

  const editHolding = useCallback(
    async (id: string, input: PortfolioHoldingInput) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!user) throw new Error("You must be signed in");
      setSaving(true);
      try {
        await updateHolding(user.uid, id, input);
      } finally {
        setSaving(false);
      }
    },
    [user, isDemo]
  );

  const removeHolding = useCallback(
    async (id: string) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!user) throw new Error("You must be signed in");
      setSaving(true);
      try {
        await deleteHolding(user.uid, id);
      } finally {
        setSaving(false);
      }
    },
    [user, isDemo]
  );

  return {
    holdings,
    loading,
    error,
    saving,
    addHolding,
    editHolding,
    removeHolding,
    isEmpty: !loading && holdings.length === 0,
    isDemo,
  };
}
