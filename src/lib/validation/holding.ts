import type { PortfolioHoldingInput } from "@/types/stocks";

export interface HoldingFormErrors {
  symbol?: string;
  shares?: string;
  avgCost?: string;
  purchaseDate?: string;
}

export function validateHoldingInput(
  input: PortfolioHoldingInput
): HoldingFormErrors {
  const errors: HoldingFormErrors = {};
  const symbol = input.symbol.trim().toUpperCase();

  if (!symbol) errors.symbol = "Ticker symbol is required";
  else if (!/^[A-Z][A-Z0-9.\-]{0,9}$/.test(symbol)) {
    errors.symbol = "Enter a valid ticker (e.g. AAPL)";
  }

  if (!input.shares || input.shares <= 0) {
    errors.shares = "Quantity must be greater than 0";
  }

  if (!input.avgCost || input.avgCost <= 0) {
    errors.avgCost = "Average buy price must be greater than 0";
  }

  if (!input.purchaseDate) {
    errors.purchaseDate = "Purchase date is required";
  } else {
    const d = new Date(input.purchaseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (Number.isNaN(d.getTime())) {
      errors.purchaseDate = "Invalid date";
    } else if (d > today) {
      errors.purchaseDate = "Purchase date cannot be in the future";
    }
  }

  return errors;
}

export function hasFormErrors(errors: HoldingFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
