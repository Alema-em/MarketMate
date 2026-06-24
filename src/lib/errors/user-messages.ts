/** User-safe messages — never surface raw provider/API errors in the UI. */

const DEMO_PORTFOLIO_MSG =
  "Demo accounts use curated sample data. Sign in with a personal account to manage your portfolio.";
const DEMO_WATCHLIST_MSG =
  "Demo watchlist is read-only. Use a personal account to save your own symbols.";

export function getFriendlyAuthError(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
      ? (error as { code: string }).code
      : "";

  if (code === "auth/popup-closed-by-user") {
    return "Sign-in was cancelled. Try again when you're ready.";
  }
  if (code === "auth/popup-blocked") {
    return "Sign-in popup was blocked. Allow popups for this site and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error during sign-in. Check your connection and try again.";
  }

  return "Could not sign in right now. Please try again.";
}

export function getFriendlyFirestoreError(): string {
  return "We could not load your saved data. Refresh the page or try again shortly.";
}

export function getFriendlyQuoteError(): string {
  return "Live prices are temporarily unavailable. Showing cached or estimated values.";
}

export function getFriendlySearchError(): string {
  return "Symbol search is temporarily unavailable. Try again in a moment.";
}

export function getFriendlySaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (
    message.includes(DEMO_PORTFOLIO_MSG) ||
    message.includes(DEMO_WATCHLIST_MSG)
  ) {
    return message;
  }
  if (message.includes("signed in")) {
    return "You must be signed in to save changes.";
  }
  return "Could not save your changes. Please try again.";
}

export function getFriendlyChartError(): string {
  return "Chart data is temporarily unavailable.";
}

export { DEMO_PORTFOLIO_MSG, DEMO_WATCHLIST_MSG };
