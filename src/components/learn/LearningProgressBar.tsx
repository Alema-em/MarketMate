interface LearningProgressBarProps {
  completed: number;
  total: number;
  percent: number;
  xp?: number;
}

export function LearningProgressBar({
  completed,
  total,
  percent,
  xp,
}: LearningProgressBarProps) {
  return (
    <div className="space-y-2" aria-label="Learning path progress">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">
          {completed} of {total} lessons complete
        </span>
        {xp !== undefined && (
          <span className="font-medium text-accent">{xp} XP</span>
        )}
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated ring-1 ring-border"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
