"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatMessageBubble } from "@/components/ai/ChatMessageBubble";
import { TypingIndicator } from "@/components/ai/TypingIndicator";
import { SuggestedPrompts } from "@/components/ai/SuggestedPrompts";
import { useAIChat } from "@/hooks/useAIChat";
import type { Stock } from "@/types";
import type { PortfolioSummary } from "@/types";

interface AIAssistantProps {
  stocks: Stock[];
  summary: PortfolioSummary;
  isEmpty: boolean;
  isDemo: boolean;
  onAddInvestment?: () => void;
  compact?: boolean;
}

export function AIAssistant({
  stocks,
  summary,
  isEmpty,
  isDemo,
  onAddInvestment,
  compact = false,
}: AIAssistantProps) {
  const { messages, loading, error, hydrated, send, clear } = useAIChat({
    stocks,
    summary,
    isEmpty,
    isDemo,
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    send(text);
  };

  const handlePrompt = (prompt: string) => {
    if (loading) return;
    send(prompt);
  };

  const showEmptyOnboarding =
    hydrated && messages.length === 0 && !loading;

  return (
    <section
      className={`glass-card flex w-full min-w-0 flex-col overflow-hidden border border-border ${
        compact ? "min-h-[420px]" : "min-h-[520px] lg:min-h-[560px]"
      }`}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-surface-elevated/30 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 shadow-lg shadow-accent/25">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold tracking-tight">MarketMate AI</h2>
            <p className="text-xs text-muted">
              Educational investing copilot - Not financial advice
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            disabled={loading}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </header>

      <div
        ref={scrollRef}
        className="min-w-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-thin sm:px-5"
      >
        {showEmptyOnboarding && (
          <div className="chat-message-enter mx-auto flex w-full max-w-2xl flex-col gap-5 py-2">
            <div className="rounded-xl border border-dashed border-border bg-surface-elevated/30 p-4 text-center sm:p-5">
              <p className="text-sm font-medium text-foreground">
                {isEmpty
                  ? "Welcome to your AI investing assistant"
                  : "Ask anything about your portfolio or investing basics"}
              </p>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                {isEmpty
                  ? "Add investments to unlock personalized diversification and risk analysis. You can still learn concepts like ETFs, volatility, and dollar-cost averaging below."
                  : "I use your MarketMate holdings to explain diversification and performance without buy/sell recommendations."}
              </p>
              {isEmpty && onAddInvestment && (
                <Button
                  className="mt-4"
                  size="sm"
                  onClick={onAddInvestment}
                >
                  Add your first investment
                </Button>
              )}
            </div>
            <SuggestedPrompts onSelect={handlePrompt} disabled={loading} />
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="chat-message-enter flex min-w-0 gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-md border border-border">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-loss/30 bg-loss-muted px-3 py-2 text-xs text-loss sm:mx-5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-surface/60 p-4 sm:p-5 backdrop-blur-xl"
      >
        {messages.length > 0 && messages.length < 4 && (
          <div className="mb-3 block sm:hidden">
            <SuggestedPrompts onSelect={handlePrompt} disabled={loading} />
          </div>
        )}
        <div className="flex min-w-0 items-end gap-2 sm:gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about investing, your portfolio, or market concepts..."
            rows={1}
            disabled={loading}
            className="max-h-32 min-h-[44px] min-w-0 flex-1 resize-none rounded-xl border border-border bg-surface-elevated/50 px-4 py-3 text-sm leading-relaxed placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 h-11 w-11 p-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-muted text-center sm:text-left">
          AI responses are for education only. Not investment advice.
        </p>
      </form>
    </section>
  );
}
