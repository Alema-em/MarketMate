"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioModal } from "@/context/PortfolioModalContext";

export default function CopilotPage() {
  const { stocks, summary, isEmpty, isDemo, loading } = usePortfolio();
  const { openAdd } = usePortfolioModal();

  return (
    <AppShell title="AI Copilot">
      <div className="mx-auto w-full max-w-4xl overflow-hidden">
        {!loading && (
          <AIAssistant
            stocks={stocks}
            summary={summary}
            isEmpty={isEmpty}
            isDemo={isDemo}
            onAddInvestment={openAdd}
          />
        )}
        {loading && (
          <div className="glass-card flex min-h-[520px] items-center justify-center overflow-hidden">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          </div>
        )}
      </div>
    </AppShell>
  );
}
