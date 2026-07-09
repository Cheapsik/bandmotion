import { formatDuration } from '../../data/workouts';

interface RestViewProps {
  remaining: number;
  onSkip: () => void;
}

export function RestView({ remaining, onSkip }: RestViewProps) {
  const progress = Math.max(0, Math.min(1, remaining / 60));
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
      <p className="text-[12px] text-white/40 tracking-[0.15em] uppercase mb-8">Odpoczynek</p>

      <div className="relative w-40 h-40 mb-8">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-body text-[40px] font-light text-white tabular-nums">
            {formatDuration(remaining)}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-white/40 mb-12">Przygotuj się na kolejną serię</p>

      <button
        type="button"
        onClick={onSkip}
        className="h-11 px-8 rounded-full btn-secondary text-[14px]"
      >
        Pomiń odpoczynek
      </button>
    </div>
  );
}
