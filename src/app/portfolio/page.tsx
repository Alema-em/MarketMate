"use client";

import { useMemo, useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StockCard } from "@/components/stocks/StockCard";
import { StatCard } from "@/components/ui/StatCard";
import { MarketDataBanner } from "@/components/stocks/MarketDataBanner";
import { StockListSkeleton } from "@/components/stocks/StockListSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioModal } from "@/context/PortfolioModalContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPercent } from "@/lib/finance";

export default function PortfolioPage() {
  const {
    stocks,
    holdings,
    summary,
    loading,
    quotesRefreshing,
    error,
    dataError,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
    isEmpty,
    isDemo,
    removeHolding,
  } = usePortfolio();
  const { formatUsd, displayCurrency, ratesStale, ratesUnavailable } =
    useCurrency();
  const { openAdd, openEdit } = usePortfolioModal();
  const [filter, setFilter] = useState("");

  const isPositive = summary.totalGain >= 0;
  const statsLoading = loading && !isEmpty;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return stocks;
    return stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
  }, [stocks, filter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this holding from your portfolio?")) return;
    await removeHolding(id);
  };

  return (
    <AppShell title="Portfolio">
      <span className="space-y-6">
        {!isEmpty && (
          <MarketDataBanner
            loading={statsLoading}
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

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted max-w-lg">
            {isDemo
              ? "Sample positions for presentations — diversified across stocks, ETFs, and crypto exposure."
              : "Your holdings are saved to Firestore. Prices refresh every 5 minutes or on demand."}
          </p>
          {!isDemo && (
            <Button onClick={openAdd} className="shrink-0">
              <Plus className="h-4 w-4" />
              Add investment
            </Button>
          )}
        </header>

        {!isEmpty && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Total value"
                value={
                  statsLoading ? "—" : formatUsd(summary.totalValue)
                }
                trend={isPositive ? "gain" : "loss"}
              />
              <StatCard
                label="Gain / loss"
                value={
                  statsLoading ? "—" : formatUsd(summary.totalGain)
                }
                subValue={
                  statsLoading
                    ? undefined
                    : formatPercent(summary.totalGainPercent)
                }
                trend={isPositive ? "gain" : "loss"}
              />
              <StatCard
                label="Cost basis"
                value={
                  statsLoading ? "—" : formatUsd(summary.totalCost)
                }
              />
            </section>

            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter holdings…"
              className="w-full max-w-md rounded-xl border border-border bg-surface/60 py-2.5 px-4 text-sm text-foreground placeholder:text-muted backdrop-blur-xl focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </>
        )}

        {loading && !isEmpty ? (
          <StockListSkeleton count={4} />
        ) : isEmpty && dataError ? (
          <p className="rounded-xl border border-loss/30 bg-loss-muted px-4 py-3 text-sm text-loss">
            {dataError}
          </p>
        ) : isEmpty ? (
          <EmptyState
            icon={Briefcase}
            title="Your portfolio is empty"
            description="Record your investments with ticker, quantity, average price, and purchase date. We'll calculate live profit and loss automatically."
            action={
              <Button size="lg" onClick={openAdd}>
                <Plus className="h-5 w-5" />
                Add Your First Investment
              </Button>
            }
          />
        ) : (
          <section className="grid gap-4">
            {filtered.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onEdit={
                  !isDemo
                    ? () => {
                        const holding = holdings.find((h) => h.id === stock.id);
                        if (holding) openEdit(holding);
                      }
                    : undefined
                }
                onDelete={
                  !isDemo ? () => void handleDelete(stock.id) : undefined
                }
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted py-8">
                No holdings match your filter.
              </p>
            )}
          </section>
        )}
      </span>
    </AppShell>
  );
}
