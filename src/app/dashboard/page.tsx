"use client";

import { DollarSign, PieChart, Plus, TrendingUp, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { StockCard } from "@/components/stocks/StockCard";
import { PortfolioChart } from "@/components/charts/PortfolioChart";
import { DemoInsightsPanel } from "@/components/demo/DemoInsightsPanel";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { MarketDataBanner } from "@/components/stocks/MarketDataBanner";
import { StockListSkeleton } from "@/components/stocks/StockListSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioChart } from "@/hooks/usePortfolioChart";
import { usePortfolioModal } from "@/context/PortfolioModalContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPercent } from "@/lib/finance";

export default function DashboardPage() {
  const {
    stocks,
    holdings,
    summary,
    loading,
    quotesRefreshing,
    error,
    rateLimited,
    usingFallback,
    refresh,
    lastUpdated,
    isEmpty,
    isDemo,
  } = usePortfolio();
  const { formatDisplay, displayCurrency, ratesStale, ratesUnavailable } =
    useCurrency();
  const { openAdd } = usePortfolioModal();
  const { data: chartData, loading: chartLoading, isEmpty: chartEmpty } =
    usePortfolioChart(holdings, summary.totalValue, !loading && !isEmpty);

  const isPositive = summary.totalGain >= 0;
  const statsLoading = loading && !isEmpty;

  return (
    <AppShell title="Dashboard">
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Portfolio value"
            value={statsLoading ? "—" : formatDisplay(summary.totalValue)}
            subValue={
              isEmpty
                ? "Add investments to begin"
                : statsLoading
                  ? undefined
                  : `${formatPercent(summary.totalGainPercent)} all time`
            }
            trend={isEmpty ? "neutral" : isPositive ? "gain" : "loss"}
            icon={Wallet}
          />
          <StatCard
            label="Total gain / loss"
            value={statsLoading ? "—" : formatDisplay(summary.totalGain)}
            subValue={
              isEmpty
                ? undefined
                : isPositive
                  ? "Unrealized profit"
                  : "Unrealized loss"
            }
            trend={isEmpty ? "neutral" : isPositive ? "gain" : "loss"}
            icon={TrendingUp}
          />
          <StatCard
            label="Total invested"
            value={statsLoading ? "—" : formatDisplay(summary.totalCost)}
            icon={DollarSign}
          />
          <StatCard
            label="Holdings"
            value={statsLoading ? "—" : stocks.length.toString()}
            subValue={isEmpty ? "No positions" : "Active positions"}
            icon={PieChart}
          />
        </section>

        {isEmpty ? (
          <EmptyState
            icon={Wallet}
            title="Start building your portfolio"
            description="Add NSE/BSE holdings (e.g. RELIANCE.NS) with buy prices in ₹. New to investing? Open Learn for the First Investor path."
            action={
              <span className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" onClick={openAdd}>
                  <Plus className="h-5 w-5" />
                  Add Your First Investment
                </Button>
                <a
                  href="/learn"
                  className="text-sm font-medium text-accent hover:underline text-center"
                >
                  Start learning instead
                </a>
              </span>
            }
          />
        ) : (
          <>
            {chartEmpty ? null : chartLoading ? (
              <span className="glass-card flex h-72 items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              </span>
            ) : (
              <PortfolioChart data={chartData} />
            )}

            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top holdings</h2>
                <a
                  href="/portfolio"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  View all
                </a>
              </header>
              {statsLoading ? (
                <StockListSkeleton count={3} />
              ) : (
                <span className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {stocks.slice(0, 3).map((stock) => (
                    <StockCard key={stock.id} stock={stock} compact />
                  ))}
                </span>
              )}
            </section>

            {isDemo && <DemoInsightsPanel compact />}
          </>
        )}

        <AIAssistant
          stocks={stocks}
          summary={summary}
          isEmpty={isEmpty}
          isDemo={isDemo}
          onAddInvestment={openAdd}
        />
      </span>
    </AppShell>
  );
}
