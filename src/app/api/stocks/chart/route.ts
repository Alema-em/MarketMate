import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioChart } from "@/lib/stocks/portfolio-chart";
import {
  FALLBACK_CHART_DATA,
  scaleChartToValue,
} from "@/lib/stocks/fallback-data";
import type { PortfolioHolding } from "@/types/stocks";

export async function POST(request: NextRequest) {
  let currentValue = 0;
  let holdings: PortfolioHolding[] = [];

  try {
    const body = (await request.json()) as {
      holdings?: PortfolioHolding[];
      currentValue?: number;
    };

    holdings = body.holdings ?? [];
    currentValue = body.currentValue ?? 0;

    if (holdings.length === 0) {
      return NextResponse.json({
        data: [],
        fromFallback: true,
        rateLimited: false,
      });
    }

    const { data, fromFallback } = await buildPortfolioChart(
      holdings,
      currentValue
    );

    return NextResponse.json({
      data,
      fromFallback,
      rateLimited: fromFallback,
    });
  } catch (err) {
    console.error("Chart API error:", err);
    return NextResponse.json({
      data: scaleChartToValue(FALLBACK_CHART_DATA, currentValue),
      fromFallback: true,
      rateLimited: true,
    });
  }
}
