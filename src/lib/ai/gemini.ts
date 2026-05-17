import { SYSTEM_INSTRUCTION, buildContextPreamble } from "@/lib/ai/prompts";
import type { PortfolioContextPayload } from "@/types/ai";

const DEFAULT_MODEL = "gemini-2.0-flash";
const MAX_HISTORY_TURNS = 8;

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new GeminiError(
      "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local.",
      503
    );
  }
  return key;
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

function toGeminiHistory(
  history: { role: "user" | "assistant"; content: string }[]
): GeminiContent[] {
  return history.slice(-MAX_HISTORY_TURNS * 2).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function generateInvestingReply(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[],
  portfolio: PortfolioContextPayload
): Promise<string> {
  const apiKey = getApiKey();
  const model = getModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const portfolioJson = JSON.stringify(portfolio, null, 2);
  const contextBlock = buildContextPreamble(portfolioJson);

  const contents: GeminiContent[] = [
    ...toGeminiHistory(history),
    {
      role: "user",
      parts: [{ text: `${contextBlock}\n\nUser question: ${userMessage}` }],
    },
  ];

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 1024,
          topP: 0.9,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });
  } catch {
    throw new GeminiError("Gemini service is unavailable.", 503);
  }

  const data = (await res.json().catch(() => ({}))) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string; status?: string };
  };

  if (!res.ok) {
    const msg = data.error?.message ?? `Gemini API error (${res.status})`;
    throw new GeminiError(msg, res.status);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new GeminiError(
      "No response from Gemini. The model may have blocked the output."
    );
  }

  return text;
}
