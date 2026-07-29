import type { DisplayCurrency } from "@/types/currency";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  purchaseDate: string;
  /** Currency of avgCost / currentPrice (INR for Indian listings). */
  currency?: DisplayCurrency;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  currency?: DisplayCurrency;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
