import { Sparkles } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/lib/ai/prompts";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <section className="min-w-0 space-y-3">
      <p className="flex items-center gap-2 text-xs font-medium text-muted uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        Suggested prompts
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="prompt-chip min-w-0 border border-white/10 bg-background px-3 py-2 text-left text-xs leading-relaxed text-muted transition-colors hover:border-white/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
