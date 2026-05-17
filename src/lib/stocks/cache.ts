interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export const CACHE_TTL = {
  quote: 5 * 60 * 1000,
  search: 30 * 60 * 1000,
  dailySeries: 6 * 60 * 60 * 1000,
  portfolioChart: 15 * 60 * 1000,
} as const;
