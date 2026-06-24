import { clearChatHistory } from "@/lib/ai/chat-storage";
import { clearQuoteCache } from "@/lib/stocks/quote-cache";

const SEARCH_CACHE_KEY = "marketmate_search_v1";

/** Clears client-side session data so the next user on this device does not see it. */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  clearChatHistory();
  clearQuoteCache();
  try {
    localStorage.removeItem(SEARCH_CACHE_KEY);
  } catch {
    /* ignore */
  }
}
