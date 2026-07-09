import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowDown, ArrowUp, CircleDot, ArrowRight } from 'lucide-react';
import type { WorkoutCategory } from '../../data/mockDashboard';

const ICONS: Record<WorkoutCategory, LucideIcon> = {
  full_body: Activity,
  upper_body: ArrowUp,
  lower_body: ArrowDown,
  core: CircleDot,
};

interface CategoryWorkoutCardProps {
  label: string;
  description: string;
  category: WorkoutCategory;
  durationMinutes: number;
  exerciseCount: number;
  onClick: () => void;
}

export function CategoryWorkoutCard({
  label,
  description,
  category,
  durationMinutes,
  exerciseCount,
  onClick,
}: CategoryWorkoutCardProps) {
  const Icon = ICONS[category];

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left dashboard-mini-card rounded-3xl p-4 transition-all duration-200 active:scale-[0.97] flex flex-col"
    >
      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-3">
        <Icon size={16} strokeWidth={1.2} className="text-white/80" />
      </div>
      <div className="font-medium text-[15px] text-white leading-tight">{label}</div>
      <div className="text-[11px] text-white/40 mt-1 leading-snug">{description}</div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-[11px] text-white/35 tabular-nums">
          ~{durationMinutes} min · {exerciseCount} ćw.
        </div>
        <ArrowRight size={12} strokeWidth={1.2} className="text-white/25" />
      </div>
    </button>
  );
}
