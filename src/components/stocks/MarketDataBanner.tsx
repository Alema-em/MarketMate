import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MarketDataBannerProps {
  loading?: boolean;
  refreshing?: boolean;
  rateLimited?: boolean;
  usingFallback?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  lastUpdated?: number | null;
  displayCurrency?: string;
  fxStale?: boolean;
  fxUnavailable?: boolean;
}

export function MarketDataBanner({
  loading,
  refreshing,
  rateLimited,
  usingFallback,
  error,
  onRefresh,
  lastUpdated,
  displayCurrency,
  fxStale,
  fxUnavailable,
}: MarketDataBannerProps) {
  const showFxNote =
    displayCurrency &&
    displayCurrency !== "USD" &&
    (fxStale || fxUnavailable);

  if (
    !loading &&
    !refreshing &&
    !rateLimited &&
    !usingFallback &&
    !error &&
    !showFxNote
  )
    return null;

  return (
    <aside
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        error
          ? "border-loss/30 bg-loss-muted text-loss"
          : rateLimited || usingFallback || showFxNote
            ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
            : "border-border bg-surface/60 text-muted"
      }`}
      role="status"
    >
      <span className="flex items-center gap-2">
        {loading || refreshing ? (
          <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
        ) : error ? (
          <WifiOff className="h-4 w-4 shrink-0" />
        ) : rateLimited || usingFallback || showFxNote ? (
          <AlertTriangle className="h-4 w-4 shrink-0" />
        ) : (
          <Wifi className="h-4 w-4 shrink-0 text-gain" />
        )}
        <span>
          {loading && "Loading market data…"}
          {!loading && refreshing && "Refreshing prices…"}
          {!loading && !refreshing && error && error}
          {!loading &&
            !refreshing &&
            !error &&
            (rateLimited || usingFallback) &&
            "Using cached or fallback prices (API limit). Data refreshes every 5 min or on demand."}
          {!loading &&
            !refreshing &&
            !error &&
            !rateLimited &&
            !usingFallback &&
            !showFxNote &&
            lastUpdated &&
            `Prices updated ${formatRelative(lastUpdated)}`}
          {showFxNote &&
            (fxUnavailable
              ? `Showing USD — ${displayCurrency} exchange rates unavailable.`
              : `Values shown in ${displayCurrency} using cached exchange rates.`)}
        </span>
      </span>
      {onRefresh && !loading && !refreshing && (
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      )}
    </aside>
  );
}

function formatRelative(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
