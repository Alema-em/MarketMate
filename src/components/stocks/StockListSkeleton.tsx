export function StockListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <span className="grid gap-4" aria-busy="true" aria-label="Loading stocks">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="glass-card animate-pulse p-5"
        >
          <span className="flex gap-3">
            <span className="h-11 w-11 rounded-xl bg-surface-elevated" />
            <span className="flex-1 space-y-2">
              <span className="block h-4 w-24 rounded bg-surface-elevated" />
              <span className="block h-3 w-40 rounded bg-surface-elevated" />
            </span>
          </span>
          <span className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((__, j) => (
              <span
                key={j}
                className="h-10 rounded-lg bg-surface-elevated"
              />
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
