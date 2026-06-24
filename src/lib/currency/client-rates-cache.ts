import type { DisplayCurrency, FxRatesResponse } from "@/types/currency";
import { SUPPORTED_DISPLAY_CURRENCIES } from "@/types/currency";

const STORAGE_KEY = "marketmate_fx_rates_v1";

interface CachedFxPayload {
  rates: Record<DisplayCurrency, number>;
  fetchedAt: number;
}

function defaultRates(): Record<DisplayCurrency, number> {
  return Object.fromEntries(
    SUPPORTED_DISPLAY_CURRENCIES.map((c) => [c, c === "USD" ? 1 : 0])
  ) as Record<DisplayCurrency, number>;
}

export function readCachedFxRates(): CachedFxPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFxPayload;
    if (!parsed.rates || typeof parsed.fetchedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedFxRates(
  rates: Record<DisplayCurrency, number>,
  fetchedAt: number
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedFxPayload = { rates, fetchedAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or private mode */
  }
}

export function buildFxResponseFromCache(
  cached: CachedFxPayload | null,
  stale: boolean,
  unavailable: boolean
): FxRatesResponse {
  const rates = cached?.rates ?? defaultRates();
  if (!rates.USD) rates.USD = 1;

  return {
    base: "USD",
    rates,
    fetchedAt: cached?.fetchedAt ?? 0,
    stale,
    unavailable,
  };
}
