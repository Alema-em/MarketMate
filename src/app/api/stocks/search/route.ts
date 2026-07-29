import { NextRequest, NextResponse } from "next/server";
import { fetchYahooSearch } from "@/lib/stocks/yahoo-finance";
import { getFriendlySearchError } from "@/lib/errors/user-messages";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (q.trim().length < 1) {
      return NextResponse.json({ results: [], rateLimited: false });
    }

    const results = await fetchYahooSearch(q);

    return NextResponse.json({
      results,
      rateLimited: false,
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({
      results: [],
      rateLimited: false,
      error: getFriendlySearchError(),
    });
  }
}
