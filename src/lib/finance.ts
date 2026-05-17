import type { PortfolioSummary, Stock } from "@/types";

export function calculateStockValue(stock: Stock): number {
  return stock.shares * stock.currentPrice;
}

export function calculateStockCost(stock: Stock): number {
  return stock.shares * stock.avgCost;
}

export function calculateStockGain(stock: Stock): number {
  return calculateStockValue(stock) - calculateStockCost(stock);
}

export function calculateStockGainPercent(stock: Stock): number {
  const cost = calculateStockCost(stock);
  if (cost === 0) return 0;
  return (calculateStockGain(stock) / cost) * 100;
}

export function calculatePortfolioSummary(stocks: Stock[]): PortfolioSummary {
  const totalValue = stocks.reduce((sum, s) => sum + calculateStockValue(s), 0);
  const totalCost = stocks.reduce((sum, s) => sum + calculateStockCost(s), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost === 0 ? 0 : (totalGain / totalCost) * 100;

  return { totalValue, totalCost, totalGain, totalGainPercent };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
