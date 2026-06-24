import type { Stock } from "@/types";
import type { PortfolioContextPayload } from "@/types/ai";
import type { PortfolioSummary } from "@/types";
import type { DisplayCurrency } from "@/types/currency";
import {
  calculateStockGainPercent,
  calculateStockValue,
} from "@/lib/finance";

interface CurrencyContextForAi {
  displayCurrency: DisplayCurrency;
  convertUsd: (usd: number) => number | null;
  ratesStale: boolean;
  ratesUnavailable: boolean;
}

function toDisplay(
  usd: number,
  ctx: CurrencyContextForAi
): number {
  if (ctx.displayCurrency === "USD") return usd;
  return ctx.convertUsd(usd) ?? usd;
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

  const totalValue = summary.totalValue || 1;

  return {
    ...base,
    isEmpty: false,
    totalValue: toDisplay(summary.totalValue, currencyCtx),
    totalCost: toDisplay(summary.totalCost, currencyCtx),
    totalGain: toDisplay(summary.totalGain, currencyCtx),
    totalGainPercent: summary.totalGainPercent,
    holdings: stocks.map((s) => {
      const valueUsd = calculateStockValue(s);
      return {
        symbol: s.symbol,
        name: s.name,
        shares: s.shares,
        avgCost: toDisplay(s.avgCost, currencyCtx),
        currentPrice: toDisplay(s.currentPrice, currencyCtx),
        value: toDisplay(valueUsd, currencyCtx),
        gainPercent: calculateStockGainPercent(s),
        weightPercent: (valueUsd / totalValue) * 100,
      };
    }),
  };
}
