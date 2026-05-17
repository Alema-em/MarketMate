"use client";

import { useEffect, useState } from "react";
import type { ChartDataPoint } from "@/types";
import { fetchPortfolioChart } from "@/lib/stocks/client";
import { scaleChartToValue } from "@/lib/stocks/fallback-data";
import { DEMO_CHART_DATA } from "@/lib/demo/seed-data";
import { useDemoAccount } from "@/hooks/useDemoAccount";
import type { PortfolioHolding } from "@/types/stocks";

export function usePortfolioChart(
  holdings: PortfolioHolding[],
  currentValue: number,
  enabled = true
) {
  const { isDemo } = useDemoAccount();
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromFallback, setFromFallback] = useState(false);

  const holdingsKey = holdings.map((h) => `${h.symbol}:${h.shares}`).join("|");

  useEffect(() => {
    if (!enabled || holdings.length === 0) {
      setData([]);
      setFromFallback(false);
      setLoading(false);
      return;
    }

    if (isDemo) {
      setData(
        scaleChartToValue(
          DEMO_CHART_DATA,
          currentValue > 0 ? currentValue : DEMO_CHART_DATA[DEMO_CHART_DATA.length - 1].value
        )
      );
      setFromFallback(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchPortfolioChart(holdings, currentValue);
        if (cancelled) return;
        setData(res.data);
        setFromFallback(res.fromFallback);
      } catch {
        if (cancelled) return;
        setData([]);
        setFromFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [holdingsKey, currentValue, enabled, holdings.length, isDemo]);

  return { data, loading, fromFallback, isEmpty: holdings.length === 0 };
}
