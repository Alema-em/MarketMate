import type { DisplayCurrency } from "@/types/currency";

const CURRENCY_LOCALES: Record<DisplayCurrency, string> = {
  USD: "en-US",
  AED: "ar-AE",
  INR: "en-IN",
  GBP: "en-GB",
  EUR: "de-DE",
};

export function formatMoney(
  amount: number,
  currency: DisplayCurrency
): string {
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatCompactMoney(
  amount: number,
  currency: DisplayCurrency
): string {
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return formatMoney(amount, currency);
  }
}

export function getCurrencyLabel(currency: DisplayCurrency): string {
  const labels: Record<DisplayCurrency, string> = {
    USD: "US Dollar",
    AED: "UAE Dirham",
    INR: "Indian Rupee",
    GBP: "British Pound",
    EUR: "Euro",
  };
  return labels[currency];
}
