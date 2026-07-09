import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, ChevronRight } from 'lucide-react';
import { useWorkout } from '../hooks/useWorkout';
import { ExerciseConfigSheet } from '../components/exercises/ExerciseConfigSheet';
import {
  BAND_LEVEL_LABELS,
  configsFromWorkout,
  configsToSuggestedWorkout,
  type PlanExerciseConfig,
} from '../utils/workoutConfig';

export function WorkoutDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { workout, loading } = useWorkout(id);
  const [configs, setConfigs] = useState<PlanExerciseConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setConfigs(configsFromWorkout(workout));
    }
  }, [workout, loading]);

  const customizedWorkout = useMemo(
    () => configsToSuggestedWorkout(workout, configs),
    [workout, configs],
  );

  const editingConfig = configs.find((c) => c.exerciseId === editingId) ?? null;

  const updateConfig = (updated: PlanExerciseConfig) => {
    setConfigs((prev) =>
      prev.map((c) => (c.exerciseId === updated.exerciseId ? updated : c)),
    );
  };

  if (loading) {
    return (
      <div className="app-shell items-center justify-center">
        <div className="app-bg" />
        <div className="relative z-10 w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-bg" />

      <div className="workout-live-ambient opacity-60" aria-hidden="true">
        <div className="workout-live-blob workout-live-blob--warm" />
        <div className="workout-live-blob workout-live-blob--cool" />
      </div>

      <header
        className="relative z-10 px-5 pb-2"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Wstecz"
          className="btn-icon mb-5"
        >
          <ChevronLeft size={18} strokeWidth={1.2} className="text-white/85" />
        </button>

        <h1
          className="font-body font-light text-white tracking-tight leading-[1.1]"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)' }}
        >
          {workout.name}
        </h1>
        <p className="text-[13px] text-white/40 mt-2 tabular-nums">
          ~{customizedWorkout.durationMinutes} min · {customizedWorkout.exerciseCount} ćwiczenia
        </p>
      </header>

      <div
        className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5"
        style={{ paddingBottom: 'calc(5.5rem + max(1.25rem, env(safe-area-inset-bottom)))' }}
      >
        <p className="text-[10px] text-white/30 tracking-[0.16em] uppercase mb-4 mt-6">
          Ćwiczenia
        </p>

        <div className="flex flex-col">
          {configs.map((config, index) => (
            <button
              key={config.exerciseId}
              type="button"
              onClick={() => setEditingId(config.exerciseId)}
              className="flex items-center gap-4 py-4 border-b border-white/8 last:border-0 text-left active:opacity-70 transition-opacity"
            >
              <span className="text-[11px] text-white/25 tabular-nums w-4 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium text-white/90 truncate">{config.name}</div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                  <span className="text-[12px] text-white/40 tabular-nums">
                    {config.sets} × {config.reps}
                  </span>
                  <span className="text-white/15">·</span>
                  <span className="text-[12px] text-white/35 tabular-nums">
                    {config.restSecs}s odp.
                  </span>
                  <span className="text-white/15">·</span>
                  <span className="text-[12px] text-white/35 font-mono">{config.tempo}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-[12px] text-white/35">
                    {BAND_LEVEL_LABELS[config.bandLevel]}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} strokeWidth={1.5} className="text-white/20 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
        aria-hidden="true"
        style={{
          height: '7rem',
          background: 'linear-gradient(to top, var(--color-bg) 35%, transparent)',
        }}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 px-5"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() =>
            navigate('/workout/live', {
              state: { workoutId: workout.id, customizedWorkout },
            })
          }
          className="btn-cta btn-cta--full"
        >
          <Play size={14} strokeWidth={1.5} className="opacity-70" />
          Rozpocznij trening
        </button>
      </div>

      <ExerciseConfigSheet
        open={!!editingId}
        config={editingConfig}
        onClose={() => setEditingId(null)}
        onSave={updateConfig}
      />
    </div>
  );
}
