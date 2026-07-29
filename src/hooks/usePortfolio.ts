"use client";

import { useMemo } from "react";
import type { PortfolioSummary, Stock } from "@/types";
import type { DisplayCurrency } from "@/types/currency";
import {
  calculateStockCost,
  calculateStockValue,
} from "@/lib/finance";
import { mergeHoldingWithQuote } from "@/lib/stocks/merge";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";
import { inferQuoteCurrency } from "@/lib/stocks/market-currency";
import { usePortfolioHoldings } from "@/hooks/usePortfolioHoldings";
import { useLiveQuotes } from "@/hooks/useLiveQuotes";
import { useCurrency } from "@/context/CurrencyContext";

function summarizeInDisplayCurrency(
  stocks: Stock[],
  convertAmount: (amount: number, from: DisplayCurrency) => number | null
): PortfolioSummary {
  let totalValue = 0;
  let totalCost = 0;

  for (const stock of stocks) {
    const from = stock.currency ?? inferQuoteCurrency(stock.symbol);
    const valueNative = calculateStockValue(stock);
    const costNative = calculateStockCost(stock);
    totalValue += convertAmount(valueNative, from) ?? valueNative;
    totalCost += convertAmount(costNative, from) ?? costNative;
  }

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost === 0 ? 0 : (totalGain / totalCost) * 100;

  return { totalValue, totalCost, totalGain, totalGainPercent };
}

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

  const { convertAmount } = useCurrency();

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

  /** Summary totals are already converted into the user's display currency. */
  const summary = useMemo(
    () => summarizeInDisplayCurrency(stocks, convertAmount),
    [stocks, convertAmount]
  );

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
