import type {
  ChartApiResponse,
  QuotesApiResponse,
  SearchApiResponse,
} from "@/types/stocks";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed (${res.status})`
    );
  }
  return res.json() as Promise<T>;
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
    await fetch(`/api/stocks/quotes?${params}`, { cache: "no-store" })
  );
}

export async function fetchStockSearch(
  query: string
): Promise<SearchApiResponse> {
  const params = new URLSearchParams({ q: query });
  return parseJson(
    await fetch(`/api/stocks/search?${params}`, { cache: "no-store" })
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
  return parseJson(res);
}
