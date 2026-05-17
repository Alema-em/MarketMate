import type { ChartDataPoint } from "@/types";
import type { PortfolioHolding } from "@/types/stocks";
import { CACHE_TTL, getCached, setCached } from "@/lib/stocks/cache";
import { fetchDailySeries } from "@/lib/stocks/alpha-vantage";
import {
  FALLBACK_CHART_DATA,
  scaleChartToValue,
} from "@/lib/stocks/fallback-data";

function buildChartFromSeries(
  holdings: PortfolioHolding[],
  seriesBySymbol: Record<string, Record<string, number>>
): ChartDataPoint[] {
  const dates = new Set<string>();
  for (const series of Object.values(seriesBySymbol)) {
    Object.keys(series).forEach((d) => dates.add(d));
  }

  const sortedDates = [...dates].sort().slice(-12);

  return sortedDates.map((date) => {
    const month = new Date(date).toLocaleString("en-US", { month: "short" });
    const value = holdings.reduce((sum, h) => {
      const close = seriesBySymbol[h.symbol.toUpperCase()]?.[date];
      return sum + (close ?? h.avgCost) * h.shares;
    }, 0);
    return { date: month, value: Math.round(value * 100) / 100 };
  });
}

export async function buildPortfolioChart(
  holdings: PortfolioHolding[],
  currentPortfolioValue: number
): Promise<{ data: ChartDataPoint[]; fromFallback: boolean }> {
  const cacheKey = `portfolio-chart:${holdings.map((h) => h.symbol).join(",")}`;
  const cached = getCached<ChartDataPoint[]>(cacheKey);
  if (cached) {
    return { data: scaleChartToValue(cached, currentPortfolioValue), fromFallback: false };
  }

  const seriesBySymbol: Record<string, Record<string, number>> = {};
  let fetchedAny = false;

  for (const holding of holdings.slice(0, 2)) {
    try {
      seriesBySymbol[holding.symbol.toUpperCase()] = await fetchDailySeries(
        holding.symbol
      );
      fetchedAny = true;
    } catch {
      /* use fallback for this symbol */
    }
  }

  if (fetchedAny && Object.keys(seriesBySymbol).length > 0) {
    const data = buildChartFromSeries(holdings, seriesBySymbol);
    if (data.length > 0) {
      setCached(cacheKey, data, CACHE_TTL.portfolioChart);
      return {
        data: scaleChartToValue(data, currentPortfolioValue),
        fromFallback: false,
      };
    }
  }

  return {
    data: scaleChartToValue(FALLBACK_CHART_DATA, currentPortfolioValue),
    fromFallback: true,
  };
}
