"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DEMO_WATCHLIST_ENTRIES } from "@/lib/demo/seed-data";
import {
  addWatchlistSymbol,
  removeWatchlistItem,
} from "@/lib/firestore/watchlist";
import type { WatchlistItem } from "@/types";
import { getFriendlyFirestoreError } from "@/lib/errors/user-messages";
import type { WatchlistEntry } from "@/types/stocks";
import { quoteToWatchlistItem } from "@/lib/stocks/merge";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";
import { useLiveQuotes } from "@/hooks/useLiveQuotes";

const DEMO_READ_ONLY_MSG =
  "Demo watchlist is read-only. Use a personal account to save your own symbols.";

function mapDoc(id: string, data: DocumentData): WatchlistEntry {
  return {
    id,
    symbol: (data.symbol ?? "").toUpperCase(),
    name: data.name ?? data.symbol ?? "",
  };
}

export function useWatchlist() {
  const { user } = useAuth();
  const { isDemo } = useDemoAccount();
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setEntries(DEMO_WATCHLIST_ENTRIES);
      setLoading(false);
      setError(null);
      return;
    }

    const db = getFirebaseDb();
    if (!db || !user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, "users", user.uid, "watchlist");
    const q = query(ref, orderBy("symbol"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setEntries(snapshot.docs.map((d) => mapDoc(d.id, d.data())));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Watchlist snapshot error:", err);
        setError(getFriendlyFirestoreError());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isDemo]);

  const symbols = useMemo(() => entries.map((e) => e.symbol), [entries]);
  const {
    quotes,
    loading: quotesLoading,
    refreshing,
    error: quotesError,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
  } = useLiveQuotes(symbols);

  const items: WatchlistItem[] = useMemo(() => {
    return entries.map((entry) => {
      const quote =
        quotes[entry.symbol.toUpperCase()] ?? getFallbackQuote(entry.symbol);
      return {
        ...quoteToWatchlistItem(quote, entry.id),
        name: entry.name || quote.name,
      };
    });
  }, [entries, quotes]);

  const addSymbol = useCallback(
    async (symbol: string, name?: string) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!user) throw new Error("You must be signed in");
      const upper = symbol.toUpperCase();
      if (entries.some((e) => e.symbol === upper)) return;
      setSaving(true);
      try {
        await addWatchlistSymbol(user.uid, upper, name);
      } finally {
        setSaving(false);
      }
    },
    [user, entries, isDemo]
  );

  const removeSymbol = useCallback(
    async (itemId: string) => {
      if (isDemo) throw new Error(DEMO_READ_ONLY_MSG);
      if (!user) throw new Error("You must be signed in");
      setSaving(true);
      try {
        await removeWatchlistItem(user.uid, itemId);
      } finally {
        setSaving(false);
      }
    },
    [user, isDemo]
  );

  return {
    items,
    entries,
    loading: loading || quotesLoading,
    quotesRefreshing: refreshing,
    error: error ?? quotesError,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
    addSymbol,
    removeSymbol,
    saving,
    isEmpty: !loading && entries.length === 0,
    isDemo,
    dataError: error,
  };
}
