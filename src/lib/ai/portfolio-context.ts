import type { Stock } from "@/types";
import type { PortfolioContextPayload } from "@/types/ai";
import type { PortfolioSummary } from "@/types";
import {
  calculateStockGainPercent,
  calculateStockValue,
} from "@/lib/finance";

export function buildPortfolioContext(
  stocks: Stock[],
  summary: PortfolioSummary,
  isEmpty: boolean,
  isDemo: boolean
): PortfolioContextPayload {
  if (isEmpty || stocks.length === 0) {
    return {
      isEmpty: true,
      isDemo,
      totalValue: 0,
      totalCost: 0,
      totalGain: 0,
      totalGainPercent: 0,
      holdings: [],
    };
  }

  const totalValue = summary.totalValue || 1;

  return {
    isEmpty: false,
    isDemo,
    totalValue: summary.totalValue,
    totalCost: summary.totalCost,
    totalGain: summary.totalGain,
    totalGainPercent: summary.totalGainPercent,
    holdings: stocks.map((s) => {
      const value = calculateStockValue(s);
      return {
        symbol: s.symbol,
        name: s.name,
        shares: s.shares,
        avgCost: s.avgCost,
        currentPrice: s.currentPrice,
        value,
        gainPercent: calculateStockGainPercent(s),
        weightPercent: (value / totalValue) * 100,
      };
    }),
  };
}
