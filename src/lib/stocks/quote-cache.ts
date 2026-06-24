import type { StockQuote } from "@/types/stocks";

export const QUOTE_CACHE_TTL_MS = 5 * 60 * 1000;
export const QUOTE_THROTTLE_MS = 12_000;
const STORAGE_KEY = "marketmate_quotes_v1";

interface QuoteCachePayload {
  symbolsKey: string;
  quotes: Record<string, StockQuote>;
  fetchedAt: number;
}

let lastNetworkFetchAt = 0;
const inFlight = new Map<string, Promise<Record<string, StockQuote>>>();

export function buildSymbolsKey(symbols: string[]): string {
  return [...new Set(symbols.map((s) => s.toUpperCase()).filter(Boolean))].sort().join(",");
}

export function readQuoteCache(symbolsKey: string): Record<string, StockQuote> | null {
  if (typeof window === "undefined" || !symbolsKey) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuoteCachePayload;
    if (parsed.symbolsKey !== symbolsKey) return null;
    if (Date.now() - parsed.fetchedAt > QUOTE_CACHE_TTL_MS) return null;
    return parsed.quotes;
  } catch {
    return null;
  }
}

export function writeQuoteCache(
  symbolsKey: string,
  quotes: Record<string, StockQuote>
): void {
  if (typeof window === "undefined" || !symbolsKey) return;
  try {
    const payload: QuoteCachePayload = {
      symbolsKey,
      quotes,
      fetchedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or private mode */
  }
}

export function clearQuoteCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function canFetchNetwork(force: boolean): boolean {
  if (force) return true;
  return Date.now() - lastNetworkFetchAt >= QUOTE_THROTTLE_MS;
}

export function markNetworkFetch(): void {
  lastNetworkFetchAt = Date.now();
}

export function getInFlight(
  symbolsKey: string
): Promise<Record<string, StockQuote>> | undefined {
  return inFlight.get(symbolsKey);
}

export function setInFlight(
  symbolsKey: string,
  promise: Promise<Record<string, StockQuote>>
): void {
  inFlight.set(symbolsKey, promise);
  promise.finally(() => {
    if (inFlight.get(symbolsKey) === promise) {
      inFlight.delete(symbolsKey);
    }
  });
}
