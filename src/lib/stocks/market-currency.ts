import type { DisplayCurrency } from "@/types/currency";

/** Infer market currency from ticker. NSE/BSE Yahoo symbols use .NS / .BO. */
export function inferQuoteCurrency(symbol: string): DisplayCurrency {
  const upper = symbol.toUpperCase();
  if (upper.endsWith(".NS") || upper.endsWith(".BO")) {
    return "INR";
  }
  return "USD";
}

export function isIndianSymbol(symbol: string): boolean {
  return inferQuoteCurrency(symbol) === "INR";
}

export function currencyLabelForSymbol(symbol: string): string {
  return isIndianSymbol(symbol) ? "INR (₹)" : "USD ($)";
}
