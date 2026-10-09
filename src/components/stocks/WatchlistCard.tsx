"use client";

import { Star, X } from "lucide-react";
import type { WatchlistItem } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPercent } from "@/lib/finance";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove?: () => void;
}

export function WatchlistCard({ item, onRemove }: WatchlistCardProps) {
  const { formatAmount } = useCurrency();
  const isPositive = item.changePercent >= 0;
  const currency = item.currency ?? "USD";

  return (
    <article className="glass-card-hover flex items-center justify-between gap-4 p-4">
      <span className="flex items-center gap-3 min-w-0">
        <span className="mark h-10 w-10 font-mono text-[11px]">
          {item.symbol.replace(/\.(NS|BO)$/i, "").slice(0, 2)}
        </span>
        <span className="min-w-0">
          <h3 className="font-mono text-sm font-medium tracking-tight">
            {item.symbol}
          </h3>
          <p className="truncate text-sm text-muted">{item.name}</p>
        </span>
      </span>

      <span className="flex items-center gap-4 shrink-0">
        <span className="text-right">
          <p className="font-mono text-sm tabular-nums">
            {formatAmount(item.currentPrice, currency)}
          </p>
          <p
            className={`font-mono text-xs tabular-nums ${
              isPositive ? "text-gain" : "text-loss"
            }`}
          >
            {formatPercent(item.changePercent)}
          </p>
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-loss-muted hover:text-loss"
          aria-label={`Remove ${item.symbol} from watchlist`}
        >
          {onRemove ? (
            <X className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4 fill-accent text-accent" />
          )}
        </button>
      </span>
    </article>
  );
}
