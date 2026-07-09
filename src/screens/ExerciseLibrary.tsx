import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, ArrowRight, Clock, Dumbbell, Plus } from 'lucide-react';
import { READY_WORKOUT_CATEGORIES } from '../data/readyWorkouts';
import {
  EXERCISE_DB,
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUP_ORDER,
} from '../data/exercises';
import { CreatePlanSheet } from '../components/exercises/CreatePlanSheet';
import { db } from '../services/db';
import { estimatePlanDuration } from '../utils/customWorkout';
import type { CustomWorkout, MuscleGroup } from '../types';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Początkujący',
  intermediate: 'Średni',
  advanced: 'Zaawansowany',
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'text-emerald-400/80',
  intermediate: 'text-amber-400/80',
  advanced: 'text-rose-400/80',
};

type Tab = 'plans' | 'exercises';

export function ExerciseLibrary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('exercises');
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<MuscleGroup | null>(null);
  const [customPlans, setCustomPlans] = useState<CustomWorkout[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    db.getCustomPlans().then(setCustomPlans);
  }, []);

  const filteredExercises = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXERCISE_DB.filter((ex) => {
      const matchGroup = activeGroup ? ex.muscleGroup === activeGroup : true;
      const matchSearch = q
        ? ex.name.toLowerCase().includes(q) ||
          MUSCLE_GROUP_LABELS[ex.muscleGroup].toLowerCase().includes(q)
        : true;
      return matchGroup && matchSearch;
    });
  }, [search, activeGroup]);

  const groupedExercises = useMemo(() => {
    const groups: Partial<Record<MuscleGroup, typeof EXERCISE_DB>> = {};
    for (const ex of filteredExercises) {
      if (!groups[ex.muscleGroup]) groups[ex.muscleGroup] = [];
      groups[ex.muscleGroup]!.push(ex);
    }
    return groups;
  }, [filteredExercises]);

  const orderedGroups = MUSCLE_GROUP_ORDER.filter((g) => groupedExercises[g]?.length);

  const handleSavePlan = async (plan: CustomWorkout) => {
    await db.saveCustomPlan(plan);
    setCustomPlans((prev) => [plan, ...prev]);
  };

  return (
    <div className="animate-fade-in flex flex-col min-h-full">
      <header className="mb-5">
        <h1 className="font-body text-[28px] font-light text-white tracking-tight">Ćwiczenia</h1>

        <div className="flex gap-1.5 mt-4">
          {([
            { id: 'exercises', label: 'Wszystkie' },
            { id: 'plans', label: 'Gotowe plany' },
          ] as { id: Tab; label: string }[]).map((tab) => (
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
      </header>

      {activeTab === 'plans' && (
        <div className="flex flex-col gap-5 pb-28">
          <div className="grid grid-cols-2 gap-2.5">
            {READY_WORKOUT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/workout/${cat.id}`)}
                className="text-left dashboard-mini-card rounded-3xl p-4 transition-all duration-200 active:scale-[0.97] flex flex-col"
              >
                <div className="font-medium text-[15px] text-white leading-tight">{cat.label}</div>
                <div className="text-[11px] text-white/40 mt-1 leading-snug">{cat.description}</div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-[11px] text-white/35 tabular-nums">
                    <Clock size={10} strokeWidth={1.4} />
                    {cat.durationMinutes} min
                    <span className="text-white/20">·</span>
                    <Dumbbell size={10} strokeWidth={1.4} />
                    {cat.exerciseCount} ćw.
                  </div>
                  <ArrowRight size={12} strokeWidth={1.2} className="text-white/25" />
                </div>
              </button>
            ))}
          </div>

          {customPlans.length > 0 && (
            <section>
              <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/35 mb-2.5 px-0.5">
                Twoje plany
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {customPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => navigate(`/workout/${plan.id}`)}
                    className="text-left dashboard-mini-card rounded-3xl p-4 transition-all duration-200 active:scale-[0.97] flex flex-col"
                  >
                    <div className="font-medium text-[15px] text-white leading-tight truncate">
                      {plan.name}
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">Własny plan</div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-[11px] text-white/35 tabular-nums">
                        <Clock size={10} strokeWidth={1.4} />
                        {estimatePlanDuration(plan.exercises.length)} min
                        <span className="text-white/20">·</span>
                        <Dumbbell size={10} strokeWidth={1.4} />
                        {plan.exercises.length} ćw.
                      </div>
                      <ArrowRight size={12} strokeWidth={1.2} className="text-white/25" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="flex flex-col gap-4 pb-8">
          <div className="relative">
            <Search
              size={15}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj ćwiczeń…"
              className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10"
              >
                <X size={12} strokeWidth={2} className="text-white/60" />
              </button>
            )}
          </div>

          {!search && (
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveGroup(null)}
                className={`btn-pill shrink-0 ${activeGroup === null ? 'btn-pill--active' : ''}`}
              >
                Wszystkie
              </button>
              {MUSCLE_GROUP_ORDER.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGroup(activeGroup === g ? null : g)}
                  className={`btn-pill shrink-0 ${activeGroup === g ? 'btn-pill--active' : ''}`}
                >
                  {MUSCLE_GROUP_LABELS[g]}
                </button>
              ))}
            </div>
          )}

          {orderedGroups.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-2">
              <Search size={32} strokeWidth={1} className="text-white/20" />
              <p className="text-[14px] text-white/35">Brak wyników dla &quot;{search}&quot;</p>
            </div>
          )}

          {orderedGroups.map((group) => (
            <section key={group}>
              <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/35 mb-2 px-0.5">
                {MUSCLE_GROUP_LABELS[group]}
                <span className="ml-2 text-white/20 normal-case tracking-normal">
                  {groupedExercises[group]!.length}
                </span>
              </h2>

              <div className="dashboard-mini-card rounded-3xl overflow-hidden divide-y divide-white/[0.05]">
                {groupedExercises[group]!.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => navigate(`/exercise/${ex.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/[0.04]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-white/90 truncate">{ex.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] ${LEVEL_COLOR[ex.level]}`}>
                          {LEVEL_LABELS[ex.level]}
                        </span>
                        <span className="text-white/20 text-[10px]">·</span>
                        <span className="text-[11px] text-white/35">
                          {ex.defaultSets} × {ex.defaultReps}
                        </span>
                        <span className="text-white/20 text-[10px]">·</span>
                        <span className="text-[11px] text-white/35 uppercase tracking-wide">
                          {ex.type}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-white/20 shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === 'plans' && (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Dodaj własny plan"
          className="page-fab"
        >
          <Plus size={22} strokeWidth={1.5} />
        </button>
      )}

      <CreatePlanSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
}
