"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Stock } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import {
  calculateStockGain,
  calculateStockGainPercent,
  calculateStockValue,
  formatPercent,
} from "@/lib/finance";

interface StockCardProps {
  stock: Stock;
  compact?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StockCard({
  stock,
  compact = false,
  onEdit,
  onDelete,
}: StockCardProps) {
  const { formatAmount } = useCurrency();
  const gain = calculateStockGain(stock);
  const gainPercent = calculateStockGainPercent(stock);
  const isPositive = gain >= 0;
  const value = calculateStockValue(stock);
  const currency = stock.currency ?? "USD";

  return (
    <article className="glass-card-hover p-4 sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-3 min-w-0">
          <span className="mark h-10 w-10 font-mono text-[11px] tracking-tight">
            {stock.symbol.replace(/\.(NS|BO)$/i, "").slice(0, 2)}
          </span>
          <span className="min-w-0">
            <h3 className="font-mono text-sm font-medium tracking-tight text-foreground">
              {stock.symbol}
            </h3>
            <p className="line-clamp-1 text-sm text-muted">{stock.name}</p>
            {!compact && stock.purchaseDate && (
              <p className="text-xs text-muted mt-0.5">
                Purchased {formatPurchaseDate(stock.purchaseDate)}
              </p>
            )}
          </span>
        </span>
        <span className="flex items-start gap-2 shrink-0">
          <span
            className={`font-mono text-sm tabular-nums ${
              isPositive ? "text-gain" : "text-loss"
            }`}
          >
            {formatPercent(gainPercent)}
          </span>
          {(onEdit || onDelete) && (
            <span className="flex gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-accent"
                  aria-label={`Edit ${stock.symbol}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg p-2 text-muted hover:bg-loss-muted hover:text-loss"
                  aria-label={`Delete ${stock.symbol}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </span>
          )}
        </span>
      </header>

      <section
        className={`mt-4 grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        <Metric label="Shares" value={stock.shares.toString()} />
        <Metric label="Avg cost" value={formatAmount(stock.avgCost, currency)} />
        <Metric label="Price" value={formatAmount(stock.currentPrice, currency)} />
        <Metric
          label="Value"
          value={formatAmount(value, currency)}
          highlight={isPositive ? "gain" : "loss"}
          sub={formatAmount(gain, currency)}
        />
      </section>
    </article>
  );
}

function formatPurchaseDate(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function Metric({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "gain" | "loss";
}) {
  return (
    <span className="flex flex-col">
      <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span className="mt-1 font-mono text-sm tabular-nums text-foreground">
        {value}
      </span>
      {sub && (
        <span
          className={`text-xs font-medium ${
            highlight === "gain"
              ? "text-gain"
              : highlight === "loss"
                ? "text-loss"
                : "text-muted"
          }`}
        >
          {sub}
        </span>
      )}
    </span>
  );
}
