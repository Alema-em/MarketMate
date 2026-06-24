"use client";

import { useMemo } from "react";
import type { Stock } from "@/types";
import { calculatePortfolioSummary } from "@/lib/finance";
import { mergeHoldingWithQuote } from "@/lib/stocks/merge";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";
import { usePortfolioHoldings } from "@/hooks/usePortfolioHoldings";
import { useLiveQuotes } from "@/hooks/useLiveQuotes";

export function usePortfolio() {
  const {
    holdings,
    loading: holdingsLoading,
    error: holdingsError,
    saving,
    addHolding,
    editHolding,
    removeHolding,
    isEmpty,
    isDemo,
  } = usePortfolioHoldings();

  const symbols = useMemo(() => holdings.map((h) => h.symbol), [holdings]);

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

  const stocks: Stock[] = useMemo(() => {
    return holdings.map((holding) => {
      const quote =
        quotes[holding.symbol.toUpperCase()] ??
        getFallbackQuote(holding.symbol);
      return mergeHoldingWithQuote(holding, quote);
    });
  }, [holdings, quotes]);

  const summary = useMemo(() => calculatePortfolioSummary(stocks), [stocks]);

  const loading = holdingsLoading || (holdings.length > 0 && quotesLoading);

  return {
    stocks,
    holdings,
    summary,
    loading,
    quotesRefreshing: refreshing,
    error: holdingsError ?? quotesError,
    dataError: holdingsError,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
    saving,
    addHolding,
    editHolding,
    removeHolding,
    isEmpty,
    isDemo,
  };
}
