import { NextRequest, NextResponse } from "next/server";
import { fetchQuotesForSymbols } from "@/lib/stocks/alpha-vantage";

export async function GET(request: NextRequest) {
  try {
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

    const { quotes, rateLimited } = await fetchQuotesForSymbols(symbols);

    return NextResponse.json({
      quotes,
      errors: [],
      rateLimited,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch stock quotes",
      },
      { status: 500 }
    );
  }
}
