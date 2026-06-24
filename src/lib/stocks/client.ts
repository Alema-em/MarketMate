import type {
  ChartApiResponse,
  QuotesApiResponse,
  SearchApiResponse,
} from "@/types/stocks";
import { getFriendlyQuoteError, getFriendlySearchError } from "@/lib/errors/user-messages";

async function parseJson<T>(
  res: Response,
  fallbackMessage: string
): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(fallbackMessage);
  }
  return body as T;
}

export async function fetchQuotes(
  symbols: string[]
): Promise<QuotesApiResponse> {
  if (symbols.length === 0) {
    return { quotes: {}, errors: [], rateLimited: false };
  }
  const params = new URLSearchParams({
    symbols: symbols.join(","),
  });
  return parseJson(
    await fetch(`/api/stocks/quotes?${params}`, { cache: "no-store" }),
    getFriendlyQuoteError()
  );
}

export async function fetchStockSearch(
  query: string
): Promise<SearchApiResponse> {
  const params = new URLSearchParams({ q: query });
  return parseJson(
    await fetch(`/api/stocks/search?${params}`, { cache: "no-store" }),
    getFriendlySearchError()
  );
}

export async function fetchPortfolioChart(
  holdings: { symbol: string; shares: number; avgCost: number }[],
  currentValue: number
): Promise<ChartApiResponse> {
  const res = await fetch("/api/stocks/chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holdings, currentValue }),
    cache: "no-store",
  });
  return parseJson(res, "Chart data is temporarily unavailable.");
}
