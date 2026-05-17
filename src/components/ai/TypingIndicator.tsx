export function TypingIndicator() {
  return (
    <span
      className="flex items-center gap-1.5 px-4 py-3"
      aria-label="AI is typing"
      role="status"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-accent/80 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
