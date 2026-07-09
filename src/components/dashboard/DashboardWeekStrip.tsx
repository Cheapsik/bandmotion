import { useMemo } from 'react';
import { DAY_LABELS, getCurrentWeekDayIndex } from '../../data/mockDashboard';
import { useAppStore } from '../../store/appStore';
import { isSameWeek, toWeekDayIndex } from '../../utils/week';

interface DashboardWeekStripProps {
  emphasized?: boolean;
}

export function DashboardWeekStrip({ emphasized = false }: DashboardWeekStripProps) {
  const workoutSessions = useAppStore((s) => s.workoutSessions);
  const todayIndex = getCurrentWeekDayIndex();

  const completedIndices = useMemo(() => {
    const indices = new Set<number>();
    for (const session of workoutSessions) {
      const date = new Date(session.date);
      if (isSameWeek(date)) {
        indices.add(toWeekDayIndex(date));
      }
    }
    return indices;
  }, [workoutSessions]);

  return (
    <div className={emphasized ? 'dashboard-week-strip--emphasized' : ''}>
      <div className="flex items-center justify-between gap-1">
        {DAY_LABELS.map((label, index) => {
          const completed = completedIndices.has(index);
          const isToday = index === todayIndex;

          return (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              <span
                className={`text-[10px] truncate w-full text-center ${
                  isToday ? 'text-white font-medium' : 'text-white/45'
                }`}
              >
                {label}
              </span>
              <div
                className={`rounded-full transition-all ${
                  emphasized ? 'w-2 h-2' : 'w-1.5 h-1.5'
                } ${
                  completed
                    ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : isToday
                      ? 'border border-white/50'
                      : 'border border-white/20'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
