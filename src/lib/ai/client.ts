import type {
  ChatRequestBody,
  ChatResponseBody,
  PortfolioContextPayload,
} from "@/types/ai";

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  portfolio: PortfolioContextPayload
): Promise<string> {
  const body: ChatRequestBody = { message, history, portfolio };

  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await res.json()) as ChatResponseBody;

  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }

  if (!data.reply) {
    throw new Error("Empty response from AI");
  }

  return data.reply;
}
