import { getCached, setCached } from "@/lib/stocks/cache";
import type { DisplayCurrency } from "@/types/currency";
import {
  DEFAULT_DISPLAY_CURRENCY,
  SUPPORTED_DISPLAY_CURRENCIES,
} from "@/types/currency";

const FX_CACHE_KEY = "fx:usd-latest-v2";
const FX_TTL_MS = 60 * 60 * 1000;
const FX_STALE_MAX_MS = 24 * 60 * 60 * 1000;

const OPEN_ER_API_URL = "https://open.er-api.com/v6/latest/USD";
const FRANKFURTER_URL =
  "https://api.frankfurter.app/latest?from=USD&to=INR,GBP,EUR";

export interface ServerFxResult {
  rates: Record<DisplayCurrency, number>;
  fetchedAt: number;
  stale: boolean;
  unavailable: boolean;
}

interface OpenErApiResponse {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
}

interface FrankfurterResponse {
  rates?: Partial<Record<DisplayCurrency, number>>;
}

interface StaleFxEntry {
  rates: Record<DisplayCurrency, number>;
  fetchedAt: number;
}

function emptyRates(): Record<DisplayCurrency, number> {
  return Object.fromEntries(
    SUPPORTED_DISPLAY_CURRENCIES.map((c) => [c, c === "USD" ? 1 : 0])
  ) as Record<DisplayCurrency, number>;
}

function buildRates(
  partial: Partial<Record<DisplayCurrency, number>>
): Record<DisplayCurrency, number> {
  const rates = emptyRates();

  for (const code of SUPPORTED_DISPLAY_CURRENCIES) {
    if (code === "USD") continue;
    const rate = partial[code];
    if (typeof rate === "number" && rate > 0) {
      rates[code] = rate;
    }
  }

  return rates;
}

function hasAllRates(rates: Record<DisplayCurrency, number>): boolean {
  return SUPPORTED_DISPLAY_CURRENCIES.every(
    (code) => code === DEFAULT_DISPLAY_CURRENCY || rates[code] > 0
  );
}

function mergeRates(
  base: Record<DisplayCurrency, number>,
  extra: Partial<Record<DisplayCurrency, number>>
): Record<DisplayCurrency, number> {
  const merged = { ...base };
  for (const code of SUPPORTED_DISPLAY_CURRENCIES) {
    if (code === "USD") continue;
    const rate = extra[code];
    if (
      (merged[code] ?? 0) <= 0 &&
      typeof rate === "number" &&
      rate > 0
    ) {
      merged[code] = rate;
    }
  }
  return merged;
}

function readStaleEntry(): StaleFxEntry | null {
  const entry = getCached<StaleFxEntry>(`${FX_CACHE_KEY}:stale`);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > FX_STALE_MAX_MS) return null;
  return entry;
}

function writeStaleEntry(
  rates: Record<DisplayCurrency, number>,
  fetchedAt: number
) {
  setCached(`${FX_CACHE_KEY}:stale`, { rates, fetchedAt }, FX_STALE_MAX_MS);
}

async function fetchOpenErRates(): Promise<Partial<Record<DisplayCurrency, number>>> {
  const res = await fetch(OPEN_ER_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`open.er-api HTTP ${res.status}`);
  }

  const data = (await res.json()) as OpenErApiResponse;
  if (data.result !== "success" || !data.rates) {
    throw new Error("open.er-api returned an invalid payload");
  }

  const picked: Partial<Record<DisplayCurrency, number>> = {};
  for (const code of SUPPORTED_DISPLAY_CURRENCIES) {
    if (code === "USD") continue;
    const rate = data.rates[code];
    if (typeof rate === "number" && rate > 0) {
      picked[code] = rate;
    }
  }
  return picked;
}

async function fetchFrankfurterRates(): Promise<
  Partial<Record<DisplayCurrency, number>>
> {
  const res = await fetch(FRANKFURTER_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Frankfurter HTTP ${res.status}`);
  }
  const data = (await res.json()) as FrankfurterResponse;
  return data.rates ?? {};
}

export async function fetchUsdExchangeRates(): Promise<ServerFxResult> {
  const fresh = getCached<StaleFxEntry>(FX_CACHE_KEY);
  if (fresh && hasAllRates(fresh.rates)) {
    return {
      rates: fresh.rates,
      fetchedAt: fresh.fetchedAt,
      stale: false,
      unavailable: false,
    };
  }

  try {
    let partial = await fetchOpenErRates();
    if (!hasAllRates(buildRates(partial))) {
      const frankfurter = await fetchFrankfurterRates();
      partial = mergeRates(buildRates(partial), frankfurter);
    }

    const rates = buildRates(partial);
    if (!hasAllRates(rates)) {
      throw new Error("Incomplete FX rate set from providers");
    }

    const fetchedAt = Date.now();
    setCached(FX_CACHE_KEY, { rates, fetchedAt }, FX_TTL_MS);
    writeStaleEntry(rates, fetchedAt);

    return { rates, fetchedAt, stale: false, unavailable: false };
  } catch (err) {
    console.error("FX fetch error:", err);

    const stale = readStaleEntry();
    if (stale && hasAllRates(stale.rates)) {
      return {
        rates: stale.rates,
        fetchedAt: stale.fetchedAt,
        stale: true,
        unavailable: false,
      };
    }

    return {
      rates: stale?.rates ?? emptyRates(),
      fetchedAt: stale?.fetchedAt ?? 0,
      stale: Boolean(stale),
      unavailable: true,
    };
  }
}

export function getRateForCurrency(
  rates: Record<DisplayCurrency, number>,
  currency: DisplayCurrency
): number | null {
  if (currency === DEFAULT_DISPLAY_CURRENCY) return 1;
  const rate = rates[currency];
  return typeof rate === "number" && rate > 0 ? rate : null;
}
