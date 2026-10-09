export function Mark({ className = "text-foreground" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className={className}>
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <path
        d="M4 14.5 L8 12.5 L11.5 13.5 L15 8.5 L18 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
