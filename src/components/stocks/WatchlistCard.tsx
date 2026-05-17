import { Star, TrendingDown, TrendingUp, X } from "lucide-react";
import type { WatchlistItem } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/finance";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove?: () => void;
}

export function WatchlistCard({ item, onRemove }: WatchlistCardProps) {
  const isPositive = item.changePercent >= 0;

  return (
    <article className="glass-card-hover flex items-center justify-between gap-4 p-4">
      <span className="flex items-center gap-3 min-w-0">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-xs font-bold ring-1 ring-border">
          {item.symbol.slice(0, 2)}
        </span>
        <span className="min-w-0">
          <h3 className="font-semibold">{item.symbol}</h3>
          <p className="truncate text-sm text-muted">{item.name}</p>
        </span>
      </span>

      <span className="flex items-center gap-4 shrink-0">
        <span className="text-right">
          <p className="font-semibold">{formatCurrency(item.currentPrice)}</p>
          <p
            className={`flex items-center justify-end gap-1 text-sm font-medium ${
              isPositive ? "text-gain" : "text-loss"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
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
