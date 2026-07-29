"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioModal } from "@/context/PortfolioModalContext";

function CopilotContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? undefined;
  const { stocks, summary, isEmpty, isDemo, loading } = usePortfolio();
  const { openAdd } = usePortfolioModal();

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden">
      {!loading && (
        <AIAssistant
          stocks={stocks}
          summary={summary}
          isEmpty={isEmpty}
          isDemo={isDemo}
          onAddInvestment={openAdd}
          initialPrompt={initialPrompt}
        />
      )}
      {loading && (
        <div className="glass-card flex min-h-[520px] items-center justify-center overflow-hidden">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      )}
    </div>
  );
}

export default function CopilotPage() {
  return (
    <AppShell title="AI Copilot">
      <Suspense
        fallback={
          <div className="flex min-h-[520px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          </div>
        }
      >
        <CopilotContent />
      </Suspense>
    </AppShell>
  );
}
