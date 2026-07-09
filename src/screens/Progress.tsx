import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { MonthCalendar } from '../components/progress/MonthCalendar';
import { WeightChart } from '../components/progress/WeightChart';
import { StatCard } from '../components/progress/StatCard';
import { MeasurementSheet } from '../components/progress/MeasurementSheet';
import {
  getMostCommonWorkoutType,
  getWorkoutDaysInMonth,
  getWorkoutsInMonth,
} from '../utils/progressStats';
import { useAppStore } from '../store/appStore';

const TABS = [
  { id: 'overview', label: 'Przegląd' },
  { id: 'weight', label: 'Waga' },
];

export function Progress() {
  const workoutSessions = useAppStore((s) => s.workoutSessions);
  const measurements = useAppStore((s) => s.measurements);
  const settings = useAppStore((s) => s.settings);
  const addMeasurement = useAppStore((s) => s.addMeasurement);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const workoutDays = useMemo(
    () => getWorkoutDaysInMonth(workoutSessions, year, month),
    [workoutSessions, year, month],
  );

  const monthWorkouts = useMemo(
    () => getWorkoutsInMonth(workoutSessions, year, month),
    [workoutSessions, year, month],
  );

  const topType = useMemo(() => getMostCommonWorkoutType(monthWorkouts), [monthWorkouts]);

  const goPrevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    const isFuture = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth());
    if (isFuture) return;
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const canGoNext = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth());

  return (
    <div className="pb-8 animate-fade-in">
      <header className="mb-6">
        <h1 className="font-body text-[28px] font-light text-white tracking-tight">Postępy</h1>
      </header>

      {/* Pill tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`btn-pill ${activeTab === tab.id ? 'btn-pill--active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <section className="mb-4">
          <MonthCalendar
            year={year}
            month={month}
            workoutDays={workoutDays}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            canGoNext={canGoNext}
          />
        </section>
      )}

      {(activeTab === 'overview' || activeTab === 'weight') && (
        <section className="mb-4">
          <WeightChart measurements={measurements} weightUnit={settings.weightUnit} />
        </section>
      )}

      {activeTab === 'overview' && (
        <section className="flex flex-col gap-2 mb-6">
          <StatCard label="Treningi w tym miesiącu" value={String(monthWorkouts.length)} />
          <StatCard label="Najczęstszy typ" value={topType ?? '—'} />
        </section>
      )}

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="w-full h-12 rounded-full btn-secondary flex items-center justify-center gap-2 text-[14px]"
      >
        <Plus size={16} strokeWidth={1.5} />
        Dodaj pomiar
      </button>

      <MeasurementSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={async (data) => {
          await addMeasurement({ date: new Date().toISOString(), ...data });
        }}
        weightUnit={settings.weightUnit}
        lengthUnit={settings.lengthUnit}
      />
    </div>
  );
}
