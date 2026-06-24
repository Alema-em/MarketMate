export const SUPPORTED_DISPLAY_CURRENCIES = [
  "USD",
  "AED",
  "INR",
  "GBP",
  "EUR",
] as const;

export type DisplayCurrency = (typeof SUPPORTED_DISPLAY_CURRENCIES)[number];

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = "USD";

export interface FxRatesResponse {
  base: "USD";
  rates: Record<DisplayCurrency, number>;
  fetchedAt: number;
  stale: boolean;
  unavailable: boolean;
}
