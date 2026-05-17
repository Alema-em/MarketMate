export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface PortfolioContextPayload {
  isEmpty: boolean;
  isDemo: boolean;
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  holdings: {
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
    value: number;
    gainPercent: number;
    weightPercent: number;
  }[];
}

export interface ChatRequestBody {
  message: string;
  history: { role: ChatRole; content: string }[];
  portfolio: PortfolioContextPayload;
}

export interface ChatResponseBody {
  reply: string;
  error?: string;
  degraded?: boolean;
}
