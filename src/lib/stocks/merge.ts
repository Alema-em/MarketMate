import type { Stock, WatchlistItem } from "@/types";
import type { PortfolioHolding, StockQuote } from "@/types/stocks";
import { inferQuoteCurrency } from "@/lib/stocks/market-currency";

export function mergeHoldingWithQuote(
  holding: PortfolioHolding,
  quote: StockQuote
): Stock {
  const currency =
    quote.currency ?? inferQuoteCurrency(holding.symbol);

  return {
    id: holding.id,
    symbol: holding.symbol.toUpperCase(),
    name: holding.name ?? quote.name,
    shares: holding.shares,
    avgCost: holding.avgCost,
    currentPrice: quote.price,
    purchaseDate: holding.purchaseDate,
    currency,
  };
}

export function quoteToWatchlistItem(
  quote: StockQuote,
  id?: string
): WatchlistItem {
  return {
    id: id ?? quote.symbol,
    symbol: quote.symbol,
    name: quote.name,
    currentPrice: quote.price,
    changePercent: quote.changePercent,
    currency: quote.currency ?? inferQuoteCurrency(quote.symbol),
  };
}
