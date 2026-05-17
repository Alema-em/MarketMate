import { NextRequest, NextResponse } from "next/server";
import {
  AlphaVantageError,
  fetchSymbolSearch,
} from "@/lib/stocks/alpha-vantage";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (q.trim().length < 1) {
      return NextResponse.json({ results: [], rateLimited: false });
    }

    const results = await fetchSymbolSearch(q);

    return NextResponse.json({
      results,
      rateLimited: false,
    });
  } catch (err) {
    const rateLimited =
      err instanceof AlphaVantageError && err.rateLimited;
    return NextResponse.json(
      {
        results: [],
        rateLimited,
        error: err instanceof Error ? err.message : "Search failed",
      },
      { status: rateLimited ? 429 : 500 }
    );
  }
}
