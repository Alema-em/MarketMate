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
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? "bg-accent/20 text-accent"
            : "bg-gradient-to-br from-accent to-violet-500 text-white shadow-lg shadow-accent/20"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={`min-w-0 max-w-[88%] overflow-hidden rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isUser
            ? "bg-accent/15 border border-accent/25 text-foreground rounded-tr-md"
            : "glass-card border border-border rounded-tl-md"
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
