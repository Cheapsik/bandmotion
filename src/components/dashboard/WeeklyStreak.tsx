import { useMemo } from 'react';
import { DAY_LABELS, getCurrentWeekDayIndex } from '../../data/mockDashboard';
import { useAppStore } from '../../store/appStore';
import { isSameWeek, toWeekDayIndex } from '../../utils/week';

export function WeeklyStreak() {
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
    <div className="glass-subtle rounded-3xl px-4 py-4 border border-theme">
      <div className="text-[10px] font-medium text-theme-muted tracking-[0.12em] uppercase mb-4">
        Ten tydzień
      </div>

      <div className="flex items-center justify-between gap-1">
        {DAY_LABELS.map((label, index) => {
          const completed = completedIndices.has(index);
          const isToday = index === todayIndex;

          return (
            <div key={label} className="flex flex-col items-center gap-2 flex-1">
              <span
                className={`text-[10px] tracking-wide ${
                  isToday ? 'text-theme font-medium' : 'text-theme-muted'
                }`}
              >
                {label}
              </span>
              <div
                className={`w-[7px] h-[7px] rounded-full transition-colors ${
                  completed
                    ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                    : isToday
                      ? 'border border-white/50 bg-transparent'
                      : 'border border-white/20 bg-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
