export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  purchaseDate: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
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
