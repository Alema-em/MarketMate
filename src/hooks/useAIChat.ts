"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage } from "@/lib/ai/client";
import { useCurrency } from "@/context/CurrencyContext";
import { buildPortfolioContext } from "@/lib/ai/portfolio-context";
import {
  clearChatHistory,
  createMessage,
  loadChatHistory,
  saveChatHistory,
} from "@/lib/ai/chat-storage";
import type { ChatMessage } from "@/types/ai";
import type { Stock } from "@/types";
import type { PortfolioSummary } from "@/types";

interface UseAIChatOptions {
  stocks: Stock[];
  summary: PortfolioSummary;
  isEmpty: boolean;
  isDemo: boolean;
}

export function useAIChat({
  stocks,
  summary,
  isEmpty,
  isDemo,
}: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    setMessages(loadChatHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChatHistory(messages);
  }, [messages, hydrated]);

  const {
    displayCurrency,
    convertUsd,
    ratesStale,
    ratesUnavailable,
  } = useCurrency();

  const portfolioContext = useMemo(
    () =>
      buildPortfolioContext(stocks, summary, isEmpty, isDemo, {
        displayCurrency,
        convertUsd,
        ratesStale,
        ratesUnavailable,
      }),
    [
      stocks,
      summary,
      isEmpty,
      isDemo,
      displayCurrency,
      convertUsd,
      ratesStale,
      ratesUnavailable,
    ]
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || inFlightRef.current) return;

      inFlightRef.current = true;
      setError(null);
      setLoading(true);

      const userMsg = createMessage("user", trimmed);
      setMessages((prev) => [...prev, userMsg]);

      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const reply = await sendChatMessage(
          trimmed,
          history.slice(0, -1),
          portfolioContext
        );
        setMessages((prev) => [...prev, createMessage("assistant", reply)]);
      } catch {
        setError(
          "I could not reach MarketMate AI right now. Please try again in a moment."
        );
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [messages, portfolioContext]
  );

  const clear = useCallback(() => {
    clearChatHistory();
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    hydrated,
    send,
    clear,
    portfolioContext,
  };
}
