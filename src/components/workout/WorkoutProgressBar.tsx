interface WorkoutProgressBarProps {
  current: number;
  total: number;
}

export function WorkoutProgressBar({ current, total }: WorkoutProgressBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full transition-all duration-500"
          style={{
            background: i < current ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
    </div>
  );
}
