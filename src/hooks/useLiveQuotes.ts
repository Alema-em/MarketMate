"use client";

import { useEffect, useMemo } from "react";
import { useQuotesContext } from "@/context/QuotesContext";

/** Registers symbols with the global quote store — no duplicate fetches on rerender. */
export function useLiveQuotes(symbols: string[]) {
  const ctx = useQuotesContext();
  const symbolsKey = useMemo(
    () =>
      [...new Set(symbols.map((s) => s.toUpperCase()).filter(Boolean))]
        .sort()
        .join(","),
    [symbols]
  );

  const { registerSymbols, ...rest } = ctx;

  useEffect(() => {
    registerSymbols(symbolsKey ? symbolsKey.split(",") : []);
  }, [symbolsKey, registerSymbols]);

  return rest;
}
