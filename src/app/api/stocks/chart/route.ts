import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioChart } from "@/lib/stocks/portfolio-chart";
import type { PortfolioHolding } from "@/types/stocks";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      holdings?: PortfolioHolding[];
      currentValue?: number;
    };

    const holdings = body.holdings ?? [];
    const currentValue = body.currentValue ?? 0;

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
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to build portfolio chart",
      },
      { status: 500 }
    );
  }
}
