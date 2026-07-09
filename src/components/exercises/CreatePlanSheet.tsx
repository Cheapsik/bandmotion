import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { EXERCISE_DB, MUSCLE_GROUP_LABELS } from '../../data/exercises';
import type { CustomWorkout } from '../../types';

interface CreatePlanSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (plan: CustomWorkout) => void;
}

export function CreatePlanSheet({ open, onClose, onSave }: CreatePlanSheetProps) {
  const [planName, setPlanName] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EXERCISE_DB;
    return EXERCISE_DB.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        MUSCLE_GROUP_LABELS[ex.muscleGroup].toLowerCase().includes(q),
    );
  }, [search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    if (selected.size === 0) return;

    const exercises = [...selected].map((exerciseId) => {
      const ex = EXERCISE_DB.find((e) => e.id === exerciseId)!;
      return {
        exerciseId,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
        restSecs: ex.defaultRestSecs,
        tempo: ex.tempo,
        bandLevel: ex.bandLevel,
      };
    });

    onSave({
      id: `custom-${crypto.randomUUID()}`,
      name: planName.trim() || 'Mój plan',
      createdAt: new Date().toISOString(),
      exercises,
    });

    setPlanName('');
    setSearch('');
    setSelected(new Set());
    onClose();
  };

  const handleClose = () => {
    setPlanName('');
    setSearch('');
    setSelected(new Set());
    onClose();
  };

  return (
    <BottomSheet title="Nowy plan" open={open} onClose={handleClose}>
      <div className="flex flex-col gap-4 pb-2">
        <div>
          <label className="text-[11px] text-white/35 tracking-wide uppercase">Nazwa planu</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="np. Push A"
            className="w-full h-11 mt-1.5 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/20"
          />
        </div>

        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj ćwiczeń…"
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/20"
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

        <p className="text-[12px] text-white/35">
          Wybrano: <span className="text-white/70 tabular-nums">{selected.size}</span>
        </p>

        <div className="dashboard-mini-card rounded-2xl overflow-hidden divide-y divide-white/[0.05] max-h-[42dvh] overflow-y-auto no-scrollbar">
          {filtered.map((ex) => {
            const isSelected = selected.has(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => toggle(ex.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors active:bg-white/[0.04]"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/15 border-white/30'
                      : 'border-white/15 bg-transparent'
                  }`}
                >
                  {isSelected && <Check size={11} strokeWidth={2.5} className="text-white/90" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-white/90 truncate">{ex.name}</div>
                  <div className="text-[11px] text-white/35 mt-0.5">
                    {MUSCLE_GROUP_LABELS[ex.muscleGroup]} · {ex.defaultSets} × {ex.defaultReps}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={selected.size === 0}
          className="btn-cta btn-cta--full mt-1"
        >
          Zapisz plan
        </button>
      </div>
    </BottomSheet>
  );
}
