import type { PortfolioContextPayload } from "@/types/ai";

const UNAVAILABLE_NOTE =
  "MarketMate AI is temporarily in education-only mode because the live AI service is unavailable.";

export function buildFallbackInvestingReply(
  message: string,
  portfolio: PortfolioContextPayload
): string {
  const question = message.toLowerCase();

  if (question.includes("diversification") || question.includes("portfolio")) {
    if (portfolio.isEmpty || portfolio.holdings.length === 0) {
      return `${UNAVAILABLE_NOTE}\n\n**Diversification** means spreading money across different assets so one position does not drive your entire outcome. A simple starting point is to compare broad-market ETFs, individual stocks, cash, and any higher-risk assets separately.\n\nAdd investments in MarketMate when ready and I can help explain concentration, weights, and risk using your actual holdings.`;
    }

    const largest = [...portfolio.holdings].sort(
      (a, b) => b.weightPercent - a.weightPercent
    )[0];

    return `${UNAVAILABLE_NOTE}\n\nBased on the saved portfolio data available here, your largest position is **${largest.symbol}** at about **${largest.weightPercent.toFixed(1)}%** of the portfolio. In education terms, higher concentration can make portfolio swings depend more heavily on one company or asset.\n\nA useful review is to compare each holding's weight, sector or theme exposure, and how much of the portfolio sits in broad funds versus single-name positions.`;
  }

  if (question.includes("dollar") || question.includes("dca")) {
    return `${UNAVAILABLE_NOTE}\n\n**Dollar-cost averaging** means investing a fixed amount on a regular schedule, regardless of short-term price moves. It can reduce the pressure to time the market because purchases happen across both higher and lower prices.\n\nIt does not remove risk, but it can make an investing habit more consistent and easier to stick with.`;
  }

  if (question.includes("etf") || question.includes("stock")) {
    return `${UNAVAILABLE_NOTE}\n\n**Stocks** represent ownership in individual companies, so their results can depend heavily on one business. **ETFs** are baskets of assets, often designed to track an index, sector, or theme.\n\nFor beginners, ETFs are often easier to use for diversification, while individual stocks require more company-specific research and can be more volatile.`;
  }

  if (question.includes("rsi")) {
    return `${UNAVAILABLE_NOTE}\n\n**RSI**, or Relative Strength Index, is a momentum indicator that compares recent upward and downward price moves. Traders often view readings above 70 as potentially stretched and below 30 as potentially weak.\n\nRSI is not a prediction tool by itself. It is best treated as one context clue alongside trend, fundamentals, risk, and time horizon.`;
  }

  if (question.includes("volatile") || question.includes("risk")) {
    return `${UNAVAILABLE_NOTE}\n\n**Volatility** means the price can move sharply up or down over short periods. Higher volatility can create larger gains, but it also increases the chance of uncomfortable drawdowns.\n\nA practical risk check is to ask: how much is concentrated in one asset, how long is the investment horizon, and would a temporary decline change the plan?`;
  }

  return `${UNAVAILABLE_NOTE}\n\nI can still help with investing basics. In general, focus on **diversification**, **time horizon**, **fees**, **risk tolerance**, and whether an asset fits your overall plan.\n\nI cannot provide buy or sell instructions, but you can ask about concepts like ETFs, volatility, portfolio concentration, dollar-cost averaging, or how to read performance.`;
}

export function getFriendlyAIError(statusCode?: number): string {
  if (statusCode === 400) {
    return "I could not process that message. Try shortening it or asking one investing question at a time.";
  }

  return "MarketMate AI is taking a breather. Please try again shortly.";
}
