export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  fromFallback: boolean;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  shares: number;
  avgCost: number;
  purchaseDate: string;
  name?: string;
}

export interface PortfolioHoldingInput {
  symbol: string;
  shares: number;
  avgCost: number;
  purchaseDate: string;
  name?: string;
}

export interface WatchlistEntry {
  id: string;
  symbol: string;
  name: string;
}

export interface QuotesApiResponse {
  quotes: Record<string, StockQuote>;
  errors: string[];
  rateLimited: boolean;
}

export interface SearchApiResponse {
  results: StockSearchResult[];
  rateLimited: boolean;
  error?: string;
}

export interface ChartApiResponse {
  data: { date: string; value: number }[];
  fromFallback: boolean;
  rateLimited: boolean;
}
