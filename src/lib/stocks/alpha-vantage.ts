import { CACHE_TTL, getCached, setCached } from "@/lib/stocks/cache";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";
import type { StockQuote, StockSearchResult } from "@/types/stocks";

const AV_BASE = "https://www.alphavantage.co/query";

export class AlphaVantageError extends Error {
  constructor(
    message: string,
    public readonly rateLimited = false
  ) {
    super(message);
    this.name = "AlphaVantageError";
  }
}

function getApiKey(): string | null {
  return process.env.ALPHA_VANTAGE_API_KEY?.trim() || null;
}

function isRateLimitPayload(data: Record<string, unknown>): boolean {
  return (
    typeof data.Note === "string" ||
    typeof data.Information === "string" ||
    (typeof data.message === "string" &&
      data.message.toLowerCase().includes("rate"))
  );
}

function parseChangePercent(raw: string | undefined): number {
  if (!raw) return 0;
  return parseFloat(raw.replace("%", "")) || 0;
}

async function fetchAlphaVantage(
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new AlphaVantageError(
      "Alpha Vantage API key is not configured on the server."
    );
  }

  const url = new URL(AV_BASE);
  Object.entries({ ...params, apikey: apiKey }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new AlphaVantageError(`Alpha Vantage HTTP ${res.status}`);
  }

  const data = (await res.json()) as Record<string, unknown>;

  if (isRateLimitPayload(data)) {
    throw new AlphaVantageError(
      "Alpha Vantage rate limit reached. Showing cached or fallback data.",
      true
    );
  }

  if (data["Error Message"]) {
    throw new AlphaVantageError(String(data["Error Message"]));
  }

  return data;
}

export async function fetchGlobalQuote(
  symbol: string
): Promise<StockQuote> {
  const upper = symbol.toUpperCase();
  const cacheKey = `quote:${upper}`;
  const cached = getCached<StockQuote>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchAlphaVantage({
      function: "GLOBAL_QUOTE",
      symbol: upper,
    });

    const gq = data["Global Quote"] as Record<string, string> | undefined;
    if (!gq || !gq["05. price"]) {
      throw new AlphaVantageError(`No quote data for ${upper}`);
    }

    const quote: StockQuote = {
      symbol: gq["01. symbol"] || upper,
      name: gq["01. symbol"] || upper,
      price: parseFloat(gq["05. price"]) || 0,
      change: parseFloat(gq["09. change"]) || 0,
      changePercent: parseChangePercent(gq["10. change percent"]),
      lastUpdated: new Date().toISOString(),
      fromFallback: false,
    };

    setCached(cacheKey, quote, CACHE_TTL.quote);
    return quote;
  } catch (err) {
    const stale = getCached<StockQuote>(cacheKey);
    if (stale) return { ...stale, fromFallback: true };

    const fallback = getFallbackQuote(upper);
    if (err instanceof AlphaVantageError && err.rateLimited) {
      setCached(cacheKey, fallback, CACHE_TTL.quote);
    }
    return fallback;
  }
}

export async function fetchSymbolSearch(
  keywords: string
): Promise<StockSearchResult[]> {
  const trimmed = keywords.trim();
  if (trimmed.length < 1) return [];

  const cacheKey = `search:${trimmed.toLowerCase()}`;
  const cached = getCached<StockSearchResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchAlphaVantage({
      function: "SYMBOL_SEARCH",
      keywords: trimmed,
    });

    const matches = data.bestMatches as Array<Record<string, string>> | undefined;
    if (!matches?.length) {
      setCached(cacheKey, [], CACHE_TTL.search);
      return [];
    }

    const results: StockSearchResult[] = matches.slice(0, 8).map((m) => ({
      symbol: m["1. symbol"],
      name: m["2. name"],
      type: m["3. type"],
      region: m["4. region"],
    }));

    setCached(cacheKey, results, CACHE_TTL.search);
    return results;
  } catch {
    const stale = getCached<StockSearchResult[]>(cacheKey);
    return stale ?? [];
  }
}

export async function resolveCompanyName(symbol: string): Promise<string> {
  const upper = symbol.toUpperCase();
  const cacheKey = `company-name:${upper}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  const fallback = getFallbackQuote(upper);
  if (fallback.name !== upper) return fallback.name;

  try {
    const searchResults = await fetchSymbolSearch(upper);
    const match = searchResults.find((r) => r.symbol.toUpperCase() === upper);
    const name = match?.name ?? upper;
    setCached(cacheKey, name, CACHE_TTL.search);
    return name;
  } catch {
    return upper;
  }
}

export async function enrichQuoteWithName(
  quote: StockQuote
): Promise<StockQuote> {
  if (quote.fromFallback) {
    const fb = getFallbackQuote(quote.symbol);
    return { ...quote, name: fb.name };
  }
  if (quote.name !== quote.symbol) return quote;

  const name = await resolveCompanyName(quote.symbol);
  return { ...quote, name };
}

export async function fetchDailySeries(
  symbol: string
): Promise<Record<string, number>> {
  const upper = symbol.toUpperCase();
  const cacheKey = `daily:${upper}`;
  const cached = getCached<Record<string, number>>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchAlphaVantage({
      function: "TIME_SERIES_DAILY",
      symbol: upper,
      outputsize: "compact",
    });

    const series = data["Time Series (Daily)"] as
      | Record<string, Record<string, string>>
      | undefined;

    if (!series) {
      throw new AlphaVantageError(`No daily series for ${upper}`);
    }

    const closes: Record<string, number> = {};
    for (const [date, values] of Object.entries(series)) {
      closes[date] = parseFloat(values["4. close"]) || 0;
    }

    setCached(cacheKey, closes, CACHE_TTL.dailySeries);
    return closes;
  } catch (err) {
    if (err instanceof AlphaVantageError && err.rateLimited) {
      throw err;
    }
    throw new AlphaVantageError(`No daily series for ${upper}`);
  }
}

export async function fetchQuotesForSymbols(
  symbols: string[]
): Promise<{
  quotes: Record<string, StockQuote>;
  rateLimited: boolean;
}> {
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))];
  const quotes: Record<string, StockQuote> = {};
  let rateLimited = false;

  for (const symbol of unique) {
    try {
      let quote = await fetchGlobalQuote(symbol);
      if (quote.name === quote.symbol) {
        const fb = getFallbackQuote(symbol);
        if (fb.name !== symbol) quote = { ...quote, name: fb.name };
      }
      quotes[symbol] = quote;
    } catch (err) {
      if (err instanceof AlphaVantageError && err.rateLimited) {
        rateLimited = true;
      }
      quotes[symbol] = getFallbackQuote(symbol);
    }

    if (unique.length > 1) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return { quotes, rateLimited };
}
