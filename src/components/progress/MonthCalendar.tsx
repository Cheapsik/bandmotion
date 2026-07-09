import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear } from '../../data/profileLabels';

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

interface MonthCalendarProps {
  year: number;
  month: number;
  workoutDays: Set<number>;
  onPrev: () => void;
  onNext: () => void;
  canGoNext?: boolean;
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export function MonthCalendar({ year, month, workoutDays, onPrev, onNext, canGoNext = true }: MonthCalendarProps) {
  const days = getCalendarDays(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="dashboard-mini-card rounded-3xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Poprzedni miesiąc"
          className="btn-icon w-9 h-9"
        >
          <ChevronLeft size={16} strokeWidth={1.2} className="text-white/70" />
        </button>
        <span className="text-[14px] font-medium text-white">
          {formatMonthYear(year, month)}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Następny miesiąc"
          className="btn-icon w-9 h-9 disabled:opacity-25"
        >
          <ChevronRight size={16} strokeWidth={1.2} className="text-white/70" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-white/30 py-1 tracking-wide">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const hasWorkout = workoutDays.has(day);
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[12px] tabular-nums ${
                isToday ? 'bg-white/12 ring-1 ring-white/25' : ''
              }`}
            >
              <span className={isToday ? 'text-white font-medium' : 'text-white/50'}>
                {day}
              </span>
              {hasWorkout && (
                <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] mt-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
