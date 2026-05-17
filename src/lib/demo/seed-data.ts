import type { ChartDataPoint } from "@/types";
import type { PortfolioHolding, WatchlistEntry } from "@/types/stocks";

/** Pre-seeded portfolio for demo/admin accounts — US stocks, ETFs, crypto exposure. */
export const DEMO_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    id: "demo-aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 40,
    avgCost: 175.2,
    purchaseDate: "2024-03-15",
  },
  {
    id: "demo-msft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 22,
    avgCost: 380.0,
    purchaseDate: "2024-01-22",
  },
  {
    id: "demo-nvda",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    shares: 18,
    avgCost: 445.0,
    purchaseDate: "2023-11-08",
  },
  {
    id: "demo-googl",
    symbol: "GOOGL",
    name: "Alphabet Inc. Class A",
    shares: 14,
    avgCost: 138.5,
    purchaseDate: "2024-06-01",
  },
  {
    id: "demo-amzn",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    shares: 20,
    avgCost: 165.0,
    purchaseDate: "2024-04-18",
  },
  {
    id: "demo-spy",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    shares: 28,
    avgCost: 485.0,
    purchaseDate: "2024-02-10",
  },
  {
    id: "demo-qqq",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    shares: 16,
    avgCost: 395.0,
    purchaseDate: "2024-05-20",
  },
  {
    id: "demo-vti",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: 35,
    avgCost: 235.0,
    purchaseDate: "2023-09-12",
  },
  {
    id: "demo-gbtc",
    symbol: "GBTC",
    name: "Grayscale Bitcoin Trust ETF",
    shares: 120,
    avgCost: 58.0,
    purchaseDate: "2024-07-03",
  },
  {
    id: "demo-coin",
    symbol: "COIN",
    name: "Coinbase Global Inc.",
    shares: 12,
    avgCost: 215.0,
    purchaseDate: "2024-08-14",
  },
];

export const DEMO_WATCHLIST_ENTRIES: WatchlistEntry[] = [
  { id: "demo-w-tsla", symbol: "TSLA", name: "Tesla Inc." },
  { id: "demo-w-meta", symbol: "META", name: "Meta Platforms Inc." },
  { id: "demo-w-amd", symbol: "AMD", name: "Advanced Micro Devices Inc." },
  { id: "demo-w-arkk", symbol: "ARKK", name: "ARK Innovation ETF" },
  { id: "demo-w-hood", symbol: "HOOD", name: "Robinhood Markets Inc." },
  { id: "demo-w-mara", symbol: "MARA", name: "MARA Holdings Inc." },
];

/** Portfolio value trend for demo charts (~$142k end value at fallback prices). */
export const DEMO_CHART_DATA: ChartDataPoint[] = [
  { date: "Jan", value: 118400 },
  { date: "Feb", value: 121200 },
  { date: "Mar", value: 119800 },
  { date: "Apr", value: 124600 },
  { date: "May", value: 122900 },
  { date: "Jun", value: 128400 },
  { date: "Jul", value: 131200 },
  { date: "Aug", value: 129600 },
  { date: "Sep", value: 134800 },
  { date: "Oct", value: 138500 },
  { date: "Nov", value: 136200 },
  { date: "Dec", value: 142350 },
];

export type DemoAssetClass = "stocks" | "etfs" | "crypto";

export interface DemoAllocationSlice {
  label: string;
  class: DemoAssetClass;
  percent: number;
  color: string;
}

export const DEMO_ALLOCATION: DemoAllocationSlice[] = [
  { label: "US equities", class: "stocks", percent: 48, color: "#3b82f6" },
  { label: "Index ETFs", class: "etfs", percent: 32, color: "#22c55e" },
  { label: "Crypto exposure", class: "crypto", percent: 20, color: "#a855f7" },
];

export const DEMO_INSIGHTS = {
  riskScore: 6.2,
  riskLabel: "Moderate",
  topPerformer: { symbol: "NVDA", gainPercent: 15.2 },
  laggard: { symbol: "COIN", gainPercent: -4.8 },
  summary:
    "Your portfolio is up 14.6% overall with healthy diversification across mega-cap tech, broad-market ETFs, and crypto-linked assets. NVIDIA and Apple drive most unrealized gains; consider trimming NVDA if it exceeds 22% of total value.",
  rebalance:
    "Shift 3–5% from single-name tech into VTI or SPY to reduce concentration risk while maintaining growth exposure.",
};

export function getDemoSymbols(): string[] {
  const portfolio = DEMO_PORTFOLIO_HOLDINGS.map((h) => h.symbol);
  const watch = DEMO_WATCHLIST_ENTRIES.map((w) => w.symbol);
  return [...new Set([...portfolio, ...watch])];
}
