import type { LucideIcon } from 'lucide-react';
import { Activity, ArrowDown, ArrowUp, ChevronRight, CircleDot } from 'lucide-react';
import type { WorkoutCategory } from '../../data/mockDashboard';

const CATEGORY_ICONS: Record<WorkoutCategory, LucideIcon> = {
  full_body: Activity,
  upper_body: ArrowUp,
  lower_body: ArrowDown,
  core: CircleDot,
};

interface DashboardWorkoutRowProps {
  name: string;
  category: WorkoutCategory;
  categoryLabel: string;
  onClick: () => void;
}

export function DashboardWorkoutRow({
  name,
  category,
  categoryLabel,
  onClick,
}: DashboardWorkoutRowProps) {
  const Icon = CATEGORY_ICONS[category];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full dashboard-mini-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform min-w-0"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <Icon size={18} strokeWidth={1.2} className="text-white/80" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-white truncate">{name}</div>
        <div className="text-[12px] text-white/45 mt-0.5">{categoryLabel}</div>
      </div>
      <ChevronRight size={16} strokeWidth={1.2} className="text-white/35 shrink-0" />
    </button>
  );
}
