import { NextRequest, NextResponse } from "next/server";
import { fetchQuotesForSymbols } from "@/lib/stocks/alpha-vantage";
import { getFallbackQuote } from "@/lib/stocks/fallback-data";

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get("symbols");
  if (!symbolsParam) {
    return NextResponse.json(
      { error: "Missing symbols parameter" },
      { status: 400 }
    );
  }

  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (symbols.length > 12) {
    return NextResponse.json(
      { error: "Maximum 12 symbols per request" },
      { status: 400 }
    );
  }

  try {
    const { quotes, rateLimited } = await fetchQuotesForSymbols(symbols);

    return NextResponse.json({
      quotes,
      errors: [],
      rateLimited,
    });
  } catch (err) {
    console.error("Quotes API error:", err);
    return NextResponse.json({
      quotes: Object.fromEntries(
        symbols.map((symbol) => [symbol, getFallbackQuote(symbol)])
      ),
      errors: [],
      rateLimited: true,
    });
  }
}
