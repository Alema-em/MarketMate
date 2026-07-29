import { CACHE_TTL, getCached, setCached } from "@/lib/stocks/cache";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";
import { inferQuoteCurrency } from "@/lib/stocks/market-currency";
import type { DisplayCurrency } from "@/types/currency";
import type { StockQuote, StockSearchResult } from "@/types/stocks";

const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
const YAHOO_SEARCH = "https://query2.finance.yahoo.com/v1/finance/search";

export class YahooFinanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YahooFinanceError";
  }
}

const yahooHeaders: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (compatible; MarketMate/1.0; +https://github.com/Alema-em/MarketMate)",
  Accept: "application/json",
};

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        shortName?: string;
        longName?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        chartPreviousClose?: number;
        currency?: string;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{ close?: Array<number | null> }>;
      };
    }>;
    error?: { description?: string };
  };
}

interface YahooSearchResponse {
  quotes?: Array<{
    symbol?: string;
    shortname?: string;
    longname?: string;
    quoteType?: string;
    exchange?: string;
    exchDisp?: string;
  }>;
}

function mapYahooCurrency(code: string | undefined, symbol: string): DisplayCurrency {
  const upper = (code ?? "").toUpperCase();
  if (upper === "INR" || upper === "USD" || upper === "EUR" || upper === "GBP" || upper === "AED") {
    return upper;
  }
  return inferQuoteCurrency(symbol);
}

export async function fetchYahooQuote(symbol: string): Promise<StockQuote> {
  const upper = symbol.toUpperCase();
  const cacheKey = `yahoo-quote:${upper}`;
  const cached = getCached<StockQuote>(cacheKey);
  if (cached) return cached;

  const url = `${YAHOO_CHART}/${encodeURIComponent(upper)}?interval=1d&range=5d`;
  const res = await fetch(url, {
    headers: yahooHeaders,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new YahooFinanceError(`Yahoo HTTP ${res.status} for ${upper}`);
  }

  const data = (await res.json()) as YahooChartResult;
  const result = data.chart?.result?.[0];
  const meta = result?.meta;

  if (!meta?.regularMarketPrice && meta?.regularMarketPrice !== 0) {
    throw new YahooFinanceError(`No Yahoo quote for ${upper}`);
  }

  const price = Number(meta.regularMarketPrice) || 0;
  const prev =
    Number(meta.previousClose ?? meta.chartPreviousClose) || price;
  const change = price - prev;
  const changePercent = prev !== 0 ? (change / prev) * 100 : 0;

  const quote: StockQuote = {
    symbol: meta.symbol?.toUpperCase() || upper,
    name: meta.longName || meta.shortName || upper,
    price,
    change,
    changePercent: Math.round(changePercent * 100) / 100,
    lastUpdated: new Date().toISOString(),
    fromFallback: false,
    currency: mapYahooCurrency(meta.currency, upper),
  };

  setCached(cacheKey, quote, CACHE_TTL.quote);
  return quote;
}

export async function fetchYahooSearch(
  query: string
): Promise<StockSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const cacheKey = `yahoo-search:${trimmed.toLowerCase()}`;
  const cached = getCached<StockSearchResult[]>(cacheKey);
  if (cached) return cached;

  const url = new URL(YAHOO_SEARCH);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("quotesCount", "12");
  url.searchParams.set("newsCount", "0");

  const res = await fetch(url.toString(), {
    headers: yahooHeaders,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new YahooFinanceError(`Yahoo search HTTP ${res.status}`);
  }

  const data = (await res.json()) as YahooSearchResponse;
  const quotes = data.quotes ?? [];

  const results: StockSearchResult[] = quotes
    .filter((q) => q.symbol && (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX"))
    .slice(0, 10)
    .map((q) => ({
      symbol: (q.symbol ?? "").toUpperCase(),
      name: q.longname || q.shortname || q.symbol || "",
      type: q.quoteType ?? "Equity",
      region: q.exchDisp || q.exchange || "",
    }));

  // Prefer Indian listings when the query looks India-focused
  const indiaFirst = [...results].sort((a, b) => {
    const aIn = a.symbol.endsWith(".NS") || a.symbol.endsWith(".BO") ? 0 : 1;
    const bIn = b.symbol.endsWith(".NS") || b.symbol.endsWith(".BO") ? 0 : 1;
    return aIn - bIn;
  });

  setCached(cacheKey, indiaFirst, CACHE_TTL.search);
  return indiaFirst;
}

export async function fetchYahooDailySeries(
  symbol: string
): Promise<Record<string, number>> {
  const upper = symbol.toUpperCase();
  const cacheKey = `yahoo-daily:${upper}`;
  const cached = getCached<Record<string, number>>(cacheKey);
  if (cached) return cached;

  const url = `${YAHOO_CHART}/${encodeURIComponent(upper)}?interval=1d&range=6mo`;
  const res = await fetch(url, {
    headers: yahooHeaders,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new YahooFinanceError(`Yahoo daily HTTP ${res.status}`);
  }

  const data = (await res.json()) as YahooChartResult;
  const result = data.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const closes = result?.indicators?.quote?.[0]?.close ?? [];

  const series: Record<string, number> = {};
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (close == null || !Number.isFinite(close)) continue;
    const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
    series[date] = close;
  }

  if (Object.keys(series).length === 0) {
    throw new YahooFinanceError(`No Yahoo daily series for ${upper}`);
  }

  setCached(cacheKey, series, CACHE_TTL.dailySeries);
  return series;
}

export async function fetchQuotesViaYahoo(
  symbols: string[]
): Promise<{ quotes: Record<string, StockQuote>; failed: string[] }> {
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()).filter(Boolean))];
  const quotes: Record<string, StockQuote> = {};
  const failed: string[] = [];

  await Promise.all(
    unique.map(async (symbol) => {
      try {
        quotes[symbol] = await fetchYahooQuote(symbol);
      } catch (err) {
        console.error(`Yahoo quote failed for ${symbol}:`, err);
        failed.push(symbol);
        quotes[symbol] = {
          ...getFallbackQuote(symbol),
          currency: inferQuoteCurrency(symbol),
        };
      }
    })
  );

  return { quotes, failed };
}
