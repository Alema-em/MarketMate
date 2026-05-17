import type { ChartDataPoint } from "@/types";
import type { StockQuote } from "@/types/stocks";

/** Realistic snapshot used when Alpha Vantage rate limit is hit or API is down. */
export const FALLBACK_QUOTES: Record<string, StockQuote> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 198.42,
    change: 2.34,
    changePercent: 1.19,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 512.8,
    change: 8.45,
    changePercent: 1.68,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 412.15,
    change: -1.22,
    changePercent: -0.3,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc. Class A",
    price: 168.9,
    change: 1.05,
    changePercent: 0.63,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.5,
    change: 5.68,
    changePercent: 2.34,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 185.2,
    change: -1.62,
    changePercent: -0.87,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  META: {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 512.4,
    change: 7.86,
    changePercent: 1.56,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  AMD: {
    symbol: "AMD",
    name: "Advanced Micro Devices Inc.",
    price: 162.75,
    change: -2.01,
    changePercent: -1.22,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 521.4,
    change: 1.85,
    changePercent: 0.36,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    price: 448.2,
    change: 3.12,
    changePercent: 0.7,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  VTI: {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    price: 268.5,
    change: 0.92,
    changePercent: 0.34,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  GBTC: {
    symbol: "GBTC",
    name: "Grayscale Bitcoin Trust ETF",
    price: 62.8,
    change: 1.45,
    changePercent: 2.36,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  COIN: {
    symbol: "COIN",
    name: "Coinbase Global Inc.",
    price: 204.6,
    change: -2.35,
    changePercent: -1.14,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  ARKK: {
    symbol: "ARKK",
    name: "ARK Innovation ETF",
    price: 52.3,
    change: 0.88,
    changePercent: 1.71,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  HOOD: {
    symbol: "HOOD",
    name: "Robinhood Markets Inc.",
    price: 24.15,
    change: 0.42,
    changePercent: 1.77,
    lastUpdated: "fallback",
    fromFallback: true,
  },
  MARA: {
    symbol: "MARA",
    name: "MARA Holdings Inc.",
    price: 18.9,
    change: -0.55,
    changePercent: -2.83,
    lastUpdated: "fallback",
    fromFallback: true,
  },
};

export const FALLBACK_CHART_DATA: ChartDataPoint[] = [
  { date: "Jan", value: 42000 },
  { date: "Feb", value: 44500 },
  { date: "Mar", value: 43200 },
  { date: "Apr", value: 46800 },
  { date: "May", value: 45200 },
  { date: "Jun", value: 49100 },
  { date: "Jul", value: 51800 },
  { date: "Aug", value: 50200 },
  { date: "Sep", value: 53400 },
  { date: "Oct", value: 56100 },
  { date: "Nov", value: 54800 },
  { date: "Dec", value: 58920 },
];

export function getFallbackQuote(symbol: string): StockQuote {
  const upper = symbol.toUpperCase();
  if (FALLBACK_QUOTES[upper]) return FALLBACK_QUOTES[upper];

  return {
    symbol: upper,
    name: upper,
    price: 100,
    change: 0,
    changePercent: 0,
    lastUpdated: "fallback",
    fromFallback: true,
  };
}

export function scaleChartToValue(
  chart: ChartDataPoint[],
  targetEndValue: number
): ChartDataPoint[] {
  if (chart.length === 0) return chart;
  const last = chart[chart.length - 1].value;
  if (last === 0) return chart;
  const factor = targetEndValue / last;
  return chart.map((point) => ({
    ...point,
    value: Math.round(point.value * factor * 100) / 100,
  }));
}
