import type { Stock } from "@/types";
import type { PortfolioContextPayload } from "@/types/ai";
import type { PortfolioSummary } from "@/types";
import type { DisplayCurrency } from "@/types/currency";
import {
  calculateStockGainPercent,
  calculateStockValue,
} from "@/lib/finance";
import { inferQuoteCurrency } from "@/lib/stocks/market-currency";

interface CurrencyContextForAi {
  displayCurrency: DisplayCurrency;
  convertAmount: (amount: number, from: DisplayCurrency) => number | null;
  ratesStale: boolean;
  ratesUnavailable: boolean;
}

export function buildPortfolioContext(
  stocks: Stock[],
  summary: PortfolioSummary,
  isEmpty: boolean,
  isDemo: boolean,
  currencyCtx: CurrencyContextForAi
): PortfolioContextPayload {
  const base = {
    isEmpty: true,
    isDemo,
    baseCurrency: "USD" as const,
    displayCurrency: currencyCtx.displayCurrency,
    exchangeRatesStale: currencyCtx.ratesStale,
    exchangeRatesUnavailable: currencyCtx.ratesUnavailable,
    totalValue: 0,
    totalCost: 0,
    totalGain: 0,
    totalGainPercent: 0,
    holdings: [] as PortfolioContextPayload["holdings"],
  };

  if (isEmpty || stocks.length === 0) {
    return base;
  }

  const totalValueDisplay = summary.totalValue || 1;

  return {
    ...base,
    isEmpty: false,
    // Summary totals are already in display currency from usePortfolio.
    totalValue: summary.totalValue,
    totalCost: summary.totalCost,
    totalGain: summary.totalGain,
    totalGainPercent: summary.totalGainPercent,
    holdings: stocks.map((s) => {
      const from = s.currency ?? inferQuoteCurrency(s.symbol);
      const toDisplay = (n: number) =>
        currencyCtx.convertAmount(n, from) ?? n;
      const valueNative = calculateStockValue(s);
      return {
        symbol: s.symbol,
        name: s.name,
        shares: s.shares,
        avgCost: toDisplay(s.avgCost),
        currentPrice: toDisplay(s.currentPrice),
        value: toDisplay(valueNative),
        gainPercent: calculateStockGainPercent(s),
        weightPercent: (toDisplay(valueNative) / totalValueDisplay) * 100,
      };
    }),
  };
}
