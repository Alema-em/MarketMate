import { clearChatHistory } from "@/lib/ai/chat-storage";
import { clearQuoteCache } from "@/lib/stocks/quote-cache";

const SEARCH_CACHE_KEY = "marketmate_search_v1";
const LEARNING_PROFILE_PREFIX = "marketmate_learning_profile_v1";
const LEARNING_PROGRESS_PREFIX = "marketmate_learning_progress_v1";

/** Clears client-side session data so the next user on this device does not see it. */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  clearChatHistory();
  clearQuoteCache();
  try {
    localStorage.removeItem(SEARCH_CACHE_KEY);
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key?.startsWith(LEARNING_PROFILE_PREFIX) ||
        key?.startsWith(LEARNING_PROGRESS_PREFIX)
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
