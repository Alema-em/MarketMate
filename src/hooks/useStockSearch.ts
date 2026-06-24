"use client";

import { useEffect, useState } from "react";
import { fetchStockSearch } from "@/lib/stocks/client";
import { getFriendlySearchError } from "@/lib/errors/user-messages";
import type { StockSearchResult } from "@/types/stocks";

const SEARCH_CACHE_KEY = "marketmate_search_v1";
const SEARCH_TTL_MS = 30 * 60 * 1000;
let lastSearchFetchAt = 0;
const SEARCH_THROTTLE_MS = 800;
const inFlightSearch = new Map<string, Promise<StockSearchResult[]>>();

function readSearchCache(query: string): StockSearchResult[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SEARCH_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<
      string,
      { results: StockSearchResult[]; at: number }
    >;
    const entry = map[query.toLowerCase()];
    if (!entry || Date.now() - entry.at > SEARCH_TTL_MS) return null;
    return entry.results;
  } catch {
    return null;
  }
}

function writeSearchCache(query: string, results: StockSearchResult[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SEARCH_CACHE_KEY);
    const map = raw
      ? (JSON.parse(raw) as Record<string, { results: StockSearchResult[]; at: number }>)
      : {};
    map[query.toLowerCase()] = { results, at: Date.now() };
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function useStockSearch(query: string, debounceMs = 400) {
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      setError(null);
      setRateLimited(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      const key = trimmed.toLowerCase();
      const cached = readSearchCache(key);
      if (cached) {
        setResults(cached);
        setLoading(false);
        return;
      }

      if (Date.now() - lastSearchFetchAt < SEARCH_THROTTLE_MS) {
        return;
      }

      const existing = inFlightSearch.get(key);
      if (existing) {
        setLoading(true);
        try {
          setResults(await existing);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const promise = (async () => {
        lastSearchFetchAt = Date.now();
        const res = await fetchStockSearch(trimmed);
        writeSearchCache(key, res.results);
        return res;
      })();

      inFlightSearch.set(
        key,
        promise.then((r) => r.results)
      );

      try {
        const res = await promise;
        setResults(res.results);
        setRateLimited(res.rateLimited);
        if (res.error) setError(res.error);
      } catch (err) {
        setResults([]);
        console.error("Stock search error:", err);
        setError(getFriendlySearchError());
      } finally {
        setLoading(false);
        inFlightSearch.delete(key);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return { results, loading, error, rateLimited };
}
