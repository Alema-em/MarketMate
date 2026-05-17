"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useStockSearch } from "@/hooks/useStockSearch";
import type { StockSearchResult } from "@/types/stocks";

interface StockSearchProps {
  placeholder?: string;
  onSelect: (result: StockSearchResult) => void;
  className?: string;
}

export function StockSearch({
  placeholder = "Search stocks by symbol or name…",
  onSelect,
  className = "",
}: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading, error, rateLimited } = useStockSearch(query);

  const showDropdown = open && query.trim().length > 0;

  return (
    <span className={`relative block ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface/60 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted backdrop-blur-xl focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted" />
      )}

      {showDropdown && (
        <ul
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface shadow-xl scrollbar-thin"
          role="listbox"
        >
          {error && (
            <li className="px-4 py-3 text-sm text-loss">{error}</li>
          )}
          {rateLimited && !error && (
            <li className="px-4 py-3 text-sm text-amber-200">
              Search rate limited — try again shortly.
            </li>
          )}
          {!loading && !error && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">No symbols found</li>
          )}
          {results.map((result) => (
            <li key={result.symbol}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/5"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(result);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <span>
                  <span className="font-semibold text-foreground">
                    {result.symbol}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted line-clamp-1">
                    {result.name}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {result.region}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
