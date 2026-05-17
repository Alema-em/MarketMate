"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AIInsightsPlaceholder } from "@/components/insights/AIInsightsPlaceholder";
import { DemoInsightsPanel } from "@/components/demo/DemoInsightsPanel";
import { PortfolioChart } from "@/components/charts/PortfolioChart";
import { MarketDataBanner } from "@/components/stocks/MarketDataBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioChart } from "@/hooks/usePortfolioChart";
import { usePortfolioModal } from "@/context/PortfolioModalContext";
import { Bot, Plus } from "lucide-react";

export default function InsightsPage() {
  const {
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
  const { openAdd } = usePortfolioModal();
  const { data: chartData, loading: chartLoading, isEmpty: chartEmpty } =
    usePortfolioChart(holdings, summary.totalValue, !loading && !isEmpty);

  if (isEmpty) {
    return (
      <AppShell title="AI Insights">
        <span className="space-y-6">
          <EmptyState
            icon={Bot}
            title="Insights need portfolio data"
            description="Once you add investments, MarketMate will surface performance context and preview AI-powered analysis here."
            action={
              <Button size="lg" onClick={openAdd}>
                <Plus className="h-5 w-5" />
                Add Your First Investment
              </Button>
            }
          />
          <AIInsightsPlaceholder isEmpty onAddInvestment={openAdd} />
        </span>
      </AppShell>
    );
  }

  if (isDemo) {
    return (
      <AppShell title="AI Insights">
        <span className="space-y-6">
          <MarketDataBanner
            loading={loading}
            refreshing={quotesRefreshing}
            rateLimited={rateLimited}
            usingFallback={usingFallback}
            error={error}
            onRefresh={refresh}
            lastUpdated={lastUpdated}
          />
          <DemoInsightsPanel />
          {!chartEmpty &&
            (chartLoading ? (
              <span className="glass-card flex h-72 items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              </span>
            ) : (
              <PortfolioChart
                data={chartData}
                title="12-month portfolio growth (demo)"
              />
            ))}
        </span>
      </AppShell>
    );
  }

  return (
    <AppShell title="AI Insights">
      <span className="space-y-6">
        <MarketDataBanner
          loading={loading}
          refreshing={quotesRefreshing}
          rateLimited={rateLimited}
          usingFallback={usingFallback}
          error={error}
          onRefresh={refresh}
          lastUpdated={lastUpdated}
        />

        <AIInsightsPlaceholder />

        {!chartEmpty &&
          (chartLoading ? (
            <span className="glass-card flex h-72 items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            </span>
          ) : (
            <PortfolioChart data={chartData} title="Market context" />
          ))}
      </span>
    </AppShell>
  );
}
