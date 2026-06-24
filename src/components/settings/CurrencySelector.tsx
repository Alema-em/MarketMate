"use client";

import { ChevronDown, Coins } from "lucide-react";
import {
  useCurrency,
  SUPPORTED_DISPLAY_CURRENCIES,
} from "@/context/CurrencyContext";
import { getCurrencyLabel } from "@/lib/currency/format";
import type { DisplayCurrency } from "@/types/currency";

export function CurrencySelector() {
  const {
    displayCurrency,
    setDisplayCurrency,
    ratesStale,
    ratesUnavailable,
    ratesLoading,
    canConvert,
  } = useCurrency();

  const showFxWarning =
    displayCurrency !== "USD" &&
    (ratesStale || ratesUnavailable || !canConvert);

  return (
    <div className="mb-3 space-y-1.5">
      <label
        htmlFor="display-currency"
        className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wide text-muted"
      >
        <Coins className="h-3.5 w-3.5" />
        Display currency
      </label>
      <div className="relative">
        <select
          id="display-currency"
          value={displayCurrency}
          onChange={(e) =>
            setDisplayCurrency(e.target.value as DisplayCurrency)
          }
          className="w-full appearance-none rounded-xl border border-border bg-surface-elevated/60 py-2.5 pl-3 pr-9 text-sm font-medium text-foreground backdrop-blur-xl transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          {SUPPORTED_DISPLAY_CURRENCIES.map((code) => (
            <option key={code} value={code} className="bg-surface text-foreground">
              {code} — {getCurrencyLabel(code)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
      {ratesLoading && displayCurrency !== "USD" && (
        <p className="px-1 text-[11px] text-muted">Loading exchange rates…</p>
      )}
      {showFxWarning && !ratesLoading && (
        <p className="px-1 text-[11px] leading-snug text-amber-200/90">
          {ratesUnavailable || !canConvert
            ? "Exchange rates unavailable — showing USD until rates return."
            : "Exchange rates may be outdated — values are indicative."}
        </p>
      )}
      {displayCurrency !== "USD" && canConvert && !showFxWarning && (
        <p className="px-1 text-[11px] text-muted">
          Holdings stored in USD; prices converted for display.
        </p>
      )}
    </div>
  );
}
