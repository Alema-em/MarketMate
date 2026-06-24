import { NextRequest, NextResponse } from "next/server";
import { generateInvestingReply } from "@/lib/ai/gemini";
import {
  buildFallbackInvestingReply,
  getFriendlyAIError,
} from "@/lib/ai/fallback";
import type { ChatRequestBody, PortfolioContextPayload } from "@/types/ai";

export async function POST(request: NextRequest) {
  let requestedMessage = "";
  let requestedPortfolio: PortfolioContextPayload = {
    isEmpty: true,
    isDemo: false,
    baseCurrency: "USD",
    displayCurrency: "USD",
    exchangeRatesStale: false,
    exchangeRatesUnavailable: false,
    totalValue: 0,
    totalCost: 0,
    totalGain: 0,
    totalGainPercent: 0,
    holdings: [],
  };

  try {
    const body = (await request.json()) as ChatRequestBody;
    requestedMessage = body.message?.trim() ?? "";

    if (!requestedMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const history = Array.isArray(body.history) ? body.history : [];
    const portfolio = body.portfolio ?? requestedPortfolio;
    requestedPortfolio = portfolio;

    const reply = await generateInvestingReply(
      requestedMessage,
      history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content.slice(0, 4000),
      })),
      portfolio
    );

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);

    if (requestedMessage) {
      return NextResponse.json({
        reply: buildFallbackInvestingReply(
          requestedMessage,
          requestedPortfolio
        ),
        degraded: true,
      });
    }

    return NextResponse.json(
      { error: getFriendlyAIError() },
      { status: 400 }
    );
  }
}
