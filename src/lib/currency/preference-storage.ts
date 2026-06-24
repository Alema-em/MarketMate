import type { DisplayCurrency } from "@/types/currency";
import { DEFAULT_DISPLAY_CURRENCY, SUPPORTED_DISPLAY_CURRENCIES } from "@/types/currency";

const GLOBAL_KEY = "marketmate_display_currency_v1";

function isDisplayCurrency(value: string): value is DisplayCurrency {
  return (SUPPORTED_DISPLAY_CURRENCIES as readonly string[]).includes(value);
}

export function readLocalDisplayCurrency(uid?: string | null): DisplayCurrency {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_CURRENCY;
  try {
    if (uid) {
      const perUser = localStorage.getItem(`${GLOBAL_KEY}_${uid}`);
      if (perUser && isDisplayCurrency(perUser)) return perUser;
    }
    const global = localStorage.getItem(GLOBAL_KEY);
    if (global && isDisplayCurrency(global)) return global;
  } catch {
    /* ignore */
  }
  return DEFAULT_DISPLAY_CURRENCY;
}

export function writeLocalDisplayCurrency(
  currency: DisplayCurrency,
  uid?: string | null
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GLOBAL_KEY, currency);
    if (uid) {
      localStorage.setItem(`${GLOBAL_KEY}_${uid}`, currency);
    }
  } catch {
    /* ignore */
  }
}
