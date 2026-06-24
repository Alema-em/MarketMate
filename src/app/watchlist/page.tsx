"use client";

import { Plus, Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { WatchlistCard } from "@/components/stocks/WatchlistCard";
import { MarketDataBanner } from "@/components/stocks/MarketDataBanner";
import { StockListSkeleton } from "@/components/stocks/StockListSkeleton";
import { StockSearch } from "@/components/stocks/StockSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useCurrency } from "@/context/CurrencyContext";

export default function WatchlistPage() {
  const {
    items,
    loading,
    quotesRefreshing,
    error,
    dataError,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
    addSymbol,
    removeSymbol,
    isEmpty,
    isDemo,
  } = useWatchlist();
  const { displayCurrency, ratesStale, ratesUnavailable } = useCurrency();

  const gainers = items.filter((i) => i.changePercent >= 0).length;
  const losers = items.length - gainers;

  return (
    <AppShell title="Watchlist">
      <span className="space-y-6">
        {!isEmpty && (
          <MarketDataBanner
            loading={loading}
            refreshing={quotesRefreshing}
            rateLimited={rateLimited}
            usingFallback={usingFallback}
            error={error}
            onRefresh={refresh}
            lastUpdated={lastUpdated}
            displayCurrency={displayCurrency}
            fxStale={ratesStale}
            fxUnavailable={ratesUnavailable}
          />
        )}

        {!isEmpty && (
          <section className="glass-card flex flex-wrap gap-6 p-5">
            <span>
              <p className="text-sm text-muted">Watching</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </span>
            <span className="h-auto w-px bg-border hidden sm:block" />
            <span>
              <p className="text-sm text-muted">Gainers today</p>
              <p className="text-2xl font-bold text-gain">{gainers}</p>
            </span>
            <span className="h-auto w-px bg-border hidden sm:block" />
            <span>
              <p className="text-sm text-muted">Losers today</p>
              <p className="text-2xl font-bold text-loss">{losers}</p>
            </span>
          </section>
        )}

        {isEmpty && dataError ? (
          <p className="rounded-xl border border-loss/30 bg-loss-muted px-4 py-3 text-sm text-loss">
            {dataError}
          </p>
        ) : isEmpty ? (
          <EmptyState
            icon={Star}
            title="Your watchlist is empty"
            description="Search for stocks to track live prices and daily changes without adding them to your portfolio."
            action={
              <span className="w-full max-w-md">
                <StockSearch
                  placeholder="Search symbol to watch…"
                  onSelect={(r) => addSymbol(r.symbol, r.name)}
                />
              </span>
            }
          />
        ) : (
          <>
            {!isDemo && (
              <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <StockSearch
                  className="flex-1 max-w-md"
                  placeholder="Add symbol to watchlist…"
                  onSelect={(r) => addSymbol(r.symbol, r.name)}
                />
                <span className="flex items-center gap-2 text-sm text-muted shrink-0">
                  <Plus className="h-4 w-4" />
                  Saved to your account
                </span>
              </header>
            )}

            {isDemo && (
              <p className="text-sm text-muted">
                Demo watchlist includes growth, tech, and crypto-adjacent names
                for presentation screenshots.
              </p>
            )}

            {loading ? (
              <StockListSkeleton count={4} />
            ) : (
              <section className="grid gap-3">
                {items.map((item) => (
                  <WatchlistCard
                    key={item.id}
                    item={item}
                    onRemove={isDemo ? undefined : () => removeSymbol(item.id)}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </span>
    </AppShell>
  );
}
