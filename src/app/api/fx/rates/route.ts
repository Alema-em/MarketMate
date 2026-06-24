import { NextResponse } from "next/server";
import { fetchUsdExchangeRates } from "@/lib/currency/exchange-rates";

export async function GET() {
  const result = await fetchUsdExchangeRates();

  return NextResponse.json({
    base: "USD" as const,
    rates: result.rates,
    fetchedAt: result.fetchedAt,
    stale: result.stale,
    unavailable: result.unavailable,
  });
}
