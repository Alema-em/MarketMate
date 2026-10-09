import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/types/ai";
import { ChatMarkdown } from "@/components/ai/ChatMarkdown";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`chat-message-enter flex min-w-0 gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
          isUser
            ? "border-[#f4f0e6]/40 bg-[#f4f0e6] text-[#1c1915]"
            : "border-white/15 text-foreground"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={`min-w-0 max-w-[88%] overflow-hidden px-4 py-3 sm:max-w-[75%] ${
          isUser
            ? "bg-[#f4f0e6] text-[#1c1915]"
            : "border border-white/10 bg-surface"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <ChatMarkdown content={message.content} />
        )}
      </div>
    </article>
  );
}
