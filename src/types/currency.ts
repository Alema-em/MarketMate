export const SUPPORTED_DISPLAY_CURRENCIES = [
  "INR",
  "USD",
  "AED",
  "GBP",
  "EUR",
] as const;

export type DisplayCurrency = (typeof SUPPORTED_DISPLAY_CURRENCIES)[number];

/** Default for personal India use — US/demo users can switch to USD. */
export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = "INR";

export interface FxRatesResponse {
  base: "USD";
  rates: Record<DisplayCurrency, number>;
  fetchedAt: number;
  stale: boolean;
  unavailable: boolean;
}
