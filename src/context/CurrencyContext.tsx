"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useDemoAccount } from "@/hooks/useDemoAccount";
import {
  readCachedFxRates,
  writeCachedFxRates,
  buildFxResponseFromCache,
} from "@/lib/currency/client-rates-cache";
import { formatCompactMoney, formatMoney } from "@/lib/currency/format";
import {
  readLocalDisplayCurrency,
  writeLocalDisplayCurrency,
} from "@/lib/currency/preference-storage";
import {
  saveDisplayCurrency,
  subscribeDisplayCurrency,
} from "@/lib/firestore/preferences";
import type { DisplayCurrency, FxRatesResponse } from "@/types/currency";
import {
  DEFAULT_DISPLAY_CURRENCY,
  SUPPORTED_DISPLAY_CURRENCIES,
} from "@/types/currency";

interface CurrencyContextValue {
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (currency: DisplayCurrency) => void;
  ratesLoading: boolean;
  ratesStale: boolean;
  ratesUnavailable: boolean;
  /** Convert any supported market currency into display currency. */
  convertAmount: (amount: number, from: DisplayCurrency) => number | null;
  /** Format amount that is already in display currency. */
  formatDisplay: (amount: number) => string;
  formatCompactDisplay: (amount: number) => string;
  /** Convert from market currency then format for display. */
  formatAmount: (amount: number, from?: DisplayCurrency) => string;
  /** @deprecated Prefer formatAmount — assumes USD input. */
  convertUsd: (usd: number) => number | null;
  formatUsd: (usd: number) => string;
  formatCompactUsd: (usd: number) => string;
  canConvert: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isDemo } = useDemoAccount();
  const uid = user?.uid ?? null;

  const [displayCurrency, setDisplayCurrencyState] =
    useState<DisplayCurrency>(DEFAULT_DISPLAY_CURRENCY);
  const [rates, setRates] = useState<Record<DisplayCurrency, number>>(() => {
    const cached = readCachedFxRates();
    return cached?.rates ?? { USD: 1, AED: 0, INR: 0, GBP: 0, EUR: 0 };
  });
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesStale, setRatesStale] = useState(false);
  const [ratesUnavailable, setRatesUnavailable] = useState(false);

  useEffect(() => {
    setDisplayCurrencyState(readLocalDisplayCurrency(uid));
  }, [uid]);

  useEffect(() => {
    if (!uid || isDemo) return;

    const unsubscribe = subscribeDisplayCurrency(
      uid,
      (remote) => {
        if (remote) {
          setDisplayCurrencyState(remote);
          writeLocalDisplayCurrency(remote, uid);
        }
      },
      () => {}
    );

    return unsubscribe;
  }, [uid, isDemo]);

  const loadRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const res = await fetch("/api/fx/rates", { cache: "no-store" });
      const data = (await res.json()) as FxRatesResponse;
      const complete =
        data.rates?.USD === 1 &&
        ["AED", "INR", "GBP", "EUR"].every(
          (code) =>
            typeof data.rates[code as DisplayCurrency] === "number" &&
            data.rates[code as DisplayCurrency] > 0
        );

      setRates(data.rates);
      setRatesStale(data.stale || !complete);
      setRatesUnavailable(data.unavailable || !complete);
      if (!data.unavailable && complete && data.fetchedAt > 0) {
        writeCachedFxRates(data.rates, data.fetchedAt);
      }
    } catch (err) {
      console.error("Client FX fetch error:", err);
      const cached = readCachedFxRates();
      const fallback = buildFxResponseFromCache(cached, true, !cached);
      setRates(fallback.rates);
      setRatesStale(fallback.stale || Boolean(cached));
      setRatesUnavailable(fallback.unavailable);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRates();
    const interval = setInterval(() => void loadRates(), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadRates]);

  const rateUsdTo = useCallback(
    (currency: DisplayCurrency): number | null => {
      if (currency === "USD") return 1;
      const rate = rates[currency];
      return typeof rate === "number" && rate > 0 ? rate : null;
    },
    [rates]
  );

  const convertAmount = useCallback(
    (amount: number, from: DisplayCurrency): number | null => {
      if (from === displayCurrency) return amount;
      const fromRate = rateUsdTo(from);
      const toRate = rateUsdTo(displayCurrency);
      if (fromRate === null || toRate === null) return null;
      const usd = amount / fromRate;
      return usd * toRate;
    },
    [displayCurrency, rateUsdTo]
  );

  const canConvert = useMemo(() => {
    return rateUsdTo(displayCurrency) !== null;
  }, [displayCurrency, rateUsdTo]);

  const setDisplayCurrency = useCallback(
    (currency: DisplayCurrency) => {
      setDisplayCurrencyState(currency);
      writeLocalDisplayCurrency(currency, uid);
      if (uid && !isDemo) {
        void saveDisplayCurrency(uid, currency).catch((err) => {
          console.error("Failed to save display currency:", err);
        });
      }
    },
    [uid, isDemo]
  );

  const formatDisplay = useCallback(
    (amount: number) => formatMoney(amount, displayCurrency),
    [displayCurrency]
  );

  const formatCompactDisplay = useCallback(
    (amount: number) => formatCompactMoney(amount, displayCurrency),
    [displayCurrency]
  );

  const formatAmount = useCallback(
    (amount: number, from: DisplayCurrency = "USD") => {
      const converted = convertAmount(amount, from);
      if (converted === null) {
        return formatMoney(amount, from);
      }
      return formatMoney(converted, displayCurrency);
    },
    [convertAmount, displayCurrency]
  );

  const convertUsd = useCallback(
    (usd: number) => convertAmount(usd, "USD"),
    [convertAmount]
  );

  const formatUsd = useCallback(
    (usd: number) => formatAmount(usd, "USD"),
    [formatAmount]
  );

  const formatCompactUsd = useCallback(
    (usd: number) => {
      const converted = convertAmount(usd, "USD");
      if (converted === null) {
        return formatCompactMoney(usd, "USD");
      }
      return formatCompactMoney(converted, displayCurrency);
    },
    [convertAmount, displayCurrency]
  );

  const value = useMemo(
    () => ({
      displayCurrency,
      setDisplayCurrency,
      ratesLoading,
      ratesStale,
      ratesUnavailable:
        ratesUnavailable || rateUsdTo(displayCurrency) === null,
      convertAmount,
      formatDisplay,
      formatCompactDisplay,
      formatAmount,
      convertUsd,
      formatUsd,
      formatCompactUsd,
      canConvert,
    }),
    [
      displayCurrency,
      setDisplayCurrency,
      ratesLoading,
      ratesStale,
      ratesUnavailable,
      rateUsdTo,
      convertAmount,
      formatDisplay,
      formatCompactDisplay,
      formatAmount,
      convertUsd,
      formatUsd,
      formatCompactUsd,
      canConvert,
    ]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

export { SUPPORTED_DISPLAY_CURRENCIES };
