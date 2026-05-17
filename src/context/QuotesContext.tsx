"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchQuotes } from "@/lib/stocks/client";
import {
  buildSymbolsKey,
  canFetchNetwork,
  getInFlight,
  markNetworkFetch,
  QUOTE_CACHE_TTL_MS,
  readQuoteCache,
  setInFlight,
  writeQuoteCache,
} from "@/lib/stocks/quote-cache";
import type { StockQuote } from "@/types/stocks";

interface QuotesContextValue {
  quotes: Record<string, StockQuote>;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  rateLimited: boolean;
  usingFallback: boolean;
  refresh: () => Promise<void>;
  registerSymbols: (symbols: string[]) => void;
  lastUpdated: number | null;
}

const QuotesContext = createContext<QuotesContextValue | null>(null);

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const symbolsKey = useMemo(() => buildSymbolsKey(registry), [registry]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const registerSymbols = useCallback((symbols: string[]) => {
    const next = buildSymbolsKey(symbols).split(",").filter(Boolean);
    setRegistry((prev) => {
      const prevKey = buildSymbolsKey(prev);
      const nextKey = buildSymbolsKey(next);
      if (prevKey === nextKey) return prev;
      return next;
    });
  }, []);

  const loadQuotes = useCallback(
    async (force = false) => {
      if (!symbolsKey) {
        setQuotes({});
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const symbols = symbolsKey.split(",");
      const cached = readQuoteCache(symbolsKey);

      if (cached && !force) {
        setQuotes(cached);
        setUsingFallback(Object.values(cached).some((q) => q.fromFallback));
        setLastUpdated(Date.now());
        setLoading(false);
        return;
      }

      if (cached) {
        setQuotes(cached);
        setUsingFallback(Object.values(cached).some((q) => q.fromFallback));
      }

      if (!force && cached) return;

      if (!canFetchNetwork(force)) {
        setRefreshing(false);
        return;
      }

      const existing = getInFlight(symbolsKey);
      if (existing) {
        setRefreshing(true);
        try {
          const result = await existing;
          if (mountedRef.current) {
            setQuotes(result);
            setLastUpdated(Date.now());
          }
        } finally {
          if (mountedRef.current) setRefreshing(false);
        }
        return;
      }

      const isInitial = !cached;
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const fetchPromise = (async () => {
        markNetworkFetch();
        const res = await fetchQuotes(symbols);
        writeQuoteCache(symbolsKey, res.quotes);
        return { quotes: res.quotes, rateLimited: res.rateLimited };
      })();

      setInFlight(
        symbolsKey,
        fetchPromise.then((r) => r.quotes)
      );

      try {
        const { quotes: result, rateLimited: limited } = await fetchPromise;
        if (!mountedRef.current) return;
        setQuotes(result);
        setRateLimited(limited);
        setUsingFallback(Object.values(result).some((q) => q.fromFallback));
        setLastUpdated(Date.now());
      } catch (err) {
        if (!mountedRef.current) return;
        if (cached) setQuotes(cached);
        setError(err instanceof Error ? err.message : "Failed to load quotes");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [symbolsKey]
  );

  useEffect(() => {
    mountedRef.current = true;
    loadQuotes(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      loadQuotes(true);
    }, QUOTE_CACHE_TTL_MS);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [symbolsKey, loadQuotes]);

  const refresh = useCallback(async () => {
    await loadQuotes(true);
  }, [loadQuotes]);

  const value = useMemo(
    () => ({
      quotes,
      loading,
      refreshing,
      error,
      rateLimited,
      usingFallback,
      refresh,
      registerSymbols,
      lastUpdated,
    }),
    [
      quotes,
      loading,
      refreshing,
      error,
      rateLimited,
      usingFallback,
      refresh,
      registerSymbols,
      lastUpdated,
    ]
  );

  return (
    <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>
  );
}

export function useQuotesContext() {
  const ctx = useContext(QuotesContext);
  if (!ctx) {
    throw new Error("useQuotesContext must be used within QuotesProvider");
  }
  return ctx;
}
