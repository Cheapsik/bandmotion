import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowDown, ArrowUp, CircleDot } from 'lucide-react';
import type { WorkoutCategory } from '../../data/mockDashboard';

const CATEGORY_ICONS: Record<WorkoutCategory, LucideIcon> = {
  full_body: Activity,
  upper_body: ArrowUp,
  lower_body: ArrowDown,
  core: CircleDot,
};

interface WorkoutCardProps {
  name: string;
  category: WorkoutCategory;
  categoryLabel: string;
  durationMinutes: number;
  exerciseCount: number;
  onClick: () => void;
}

export function WorkoutCard({
  name,
  category,
  categoryLabel,
  durationMinutes,
  exerciseCount,
  onClick,
}: WorkoutCardProps) {
  const Icon = CATEGORY_ICONS[category];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left glass-subtle rounded-3xl p-5 transition-all duration-200 active:scale-[0.99] border border-theme"
    >
      <div className="text-[10px] font-medium text-theme-muted tracking-[0.12em] uppercase mb-4">
        Trening na dziś
      </div>

      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl glass-strong border border-theme flex items-center justify-center flex-shrink-0">
          <Icon size={18} strokeWidth={1.2} className="text-theme" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-body text-[24px] font-light text-theme leading-tight">{name}</div>
          <div className="text-[13px] text-theme-muted mt-1">{categoryLabel}</div>
        </div>
      </div>

      <div className="flex items-center gap-0 mt-5">
        <div className="stat-row flex-1 rounded-xl h-12 px-3">
          <span className="text-[11px] text-theme-muted">Czas</span>
          <span className="w-px h-5 bg-[var(--color-border)] mx-2" />
          <span className="text-[14px] font-medium text-theme tabular-nums">~{durationMinutes} min</span>
        </div>
        <div className="w-2" />
        <div className="stat-row flex-1 rounded-xl h-12 px-3">
          <span className="text-[11px] text-theme-muted">Ćwiczenia</span>
          <span className="w-px h-5 bg-[var(--color-border)] mx-2" />
          <span className="text-[14px] font-medium text-theme tabular-nums">{exerciseCount}</span>
        </div>
      </div>
    </button>
  );
}
