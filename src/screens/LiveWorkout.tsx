import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { CompleteView } from '../components/workout/CompleteView';
import { RestView } from '../components/workout/RestView';
import { WorkoutProgressBar } from '../components/workout/WorkoutProgressBar';
import { formatDuration, workoutTypeFromCategory } from '../data/workouts';
import { useWorkout } from '../hooks/useWorkout';
import { useCountdown } from '../hooks/useCountdown';
import { useLiveWorkout } from '../hooks/useLiveWorkout';
import { useTimer } from '../hooks/useTimer';
import { db } from '../services/db';
import { useAppStore } from '../store/appStore';

import type { SuggestedWorkout } from '../data/mockDashboard';

interface LiveWorkoutLocationState {
  workoutId?: string;
  customizedWorkout?: SuggestedWorkout;
}

function completeLabel(
  currentSetNumber: number,
  totalSets: number,
  exerciseIndex: number,
  totalExercises: number,
) {
  if (currentSetNumber >= totalSets && exerciseIndex + 1 >= totalExercises) return 'Zakończ trening';
  if (currentSetNumber >= totalSets) return 'Następne ćwiczenie';
  return 'Seria ukończona';
}

export function LiveWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LiveWorkoutLocationState | null;
  const { workout: baseWorkout } = useWorkout(state?.workoutId);
  const workout = state?.customizedWorkout ?? baseWorkout;
  const addWorkoutSession = useAppStore((s) => s.addWorkoutSession);

  const {
    phase,
    exerciseIndex,
    currentExercise,
    currentSetNumber,
    totalSets,
    totalExercises,
    exerciseLogEntries,
    restSeconds,
    completeSet,
    finishRest,
  } = useLiveWorkout(workout);

  const [startedAt] = useState(() => Date.now());
  const { seconds: setSeconds, paused, reset: resetSetTimer, togglePause } = useTimer(phase === 'active');
  const { remaining: restRemaining, isDone: restDone } = useCountdown(restSeconds, phase === 'rest');

  const [elapsed, setElapsed] = useState(0);
  const frozenDurationRef = useRef<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (phase === 'complete') {
    if (frozenDurationRef.current === null) {
      frozenDurationRef.current = Math.floor((Date.now() - startedAt) / 1000);
    }
  } else {
    frozenDurationRef.current = null;
  }

  useEffect(() => {
    if (phase === 'complete') return;

    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, phase]);

  useEffect(() => {
    if (phase === 'active') resetSetTimer();
  }, [phase, exerciseIndex, currentSetNumber, resetSetTimer]);

  useEffect(() => {
    if (phase === 'rest' && restDone) finishRest();
  }, [phase, restDone, finishRest]);

  const handleSave = async () => {
    const durationSeconds = frozenDurationRef.current ?? elapsed;
    setIsSaving(true);
    try {
      const session = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutType: workoutTypeFromCategory(workout.category),
        durationSeconds,
        exercisesCompleted: exerciseLogEntries,
      };
      await db.saveWorkout(session);
      addWorkoutSession(session);
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (phase === 'complete') {
      navigate('/dashboard');
      return;
    }
    const confirmed = window.confirm(
      'Czy na pewno chcesz zakończyć trening? Postęp nie zostanie zapisany.',
    );
    if (confirmed) navigate('/dashboard');
  };

  if (!currentExercise && phase !== 'complete') return null;

  return (
    <div className="app-shell">
      <div className="app-bg" />

      {phase === 'active' && (
        <div className="workout-live-ambient" aria-hidden="true">
          <div className="workout-live-blob workout-live-blob--warm" />
          <div className="workout-live-blob workout-live-blob--cool" />
        </div>
      )}

      {phase !== 'complete' && (
        <header
          className="relative z-10 px-4 pb-3"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Wstecz"
              className="btn-icon"
            >
              <ChevronLeft size={18} strokeWidth={1.2} className="text-white/85" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-white/55 truncate">{workout.name}</div>
              <div className="text-[11px] text-white/35 tabular-nums">
                Ćwiczenie {exerciseIndex + 1}/{totalExercises}
              </div>
            </div>
            <div className="text-[13px] text-white/55 tabular-nums">{formatDuration(elapsed)}</div>
          </div>

          <WorkoutProgressBar current={exerciseIndex + 1} total={totalExercises} />
        </header>
      )}

      {phase === 'active' && currentExercise && (
        <div className="relative z-10 flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-[11px] text-white/35 tracking-[0.14em] uppercase tabular-nums mb-6">
              Seria {currentSetNumber}/{totalSets} ·{' '}
              {currentExercise.repsLabel ?? currentExercise.reps} powt.
            </p>

            <h2
              className="font-body font-light text-white tracking-tight leading-[1.12] max-w-[19rem]"
              style={{ fontSize: 'clamp(1.75rem, 7.5vw, 2.35rem)' }}
            >
              {currentExercise.name}
            </h2>

            <div className="flex items-center gap-2 mt-7" aria-hidden="true">
              {Array.from({ length: totalSets }).map((_, i) => {
                const done = i < currentSetNumber - 1;
                const active = i === currentSetNumber - 1;
                return (
                  <div
                    key={i}
                    className="h-[3px] rounded-full transition-all duration-400"
                    style={{
                      width: active ? '1.75rem' : done ? '1.25rem' : '0.75rem',
                      background: done
                        ? 'rgba(255,255,255,0.55)'
                        : active
                          ? 'rgba(255,255,255,0.95)'
                          : 'rgba(255,255,255,0.14)',
                    }}
                  />
                );
              })}
            </div>

            <div
              className="mt-16 font-body font-light text-white tabular-nums leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.75rem, 17vw, 4.75rem)' }}
            >
              {formatDuration(setSeconds)}
            </div>

            {paused && (
              <p className="text-[10px] text-white/30 mt-4 tracking-[0.2em] uppercase">Pauza</p>
            )}
          </div>

          <div
            className="px-5 pt-1 flex flex-col items-center gap-3"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <button
              type="button"
              onClick={completeSet}
              className="btn-cta btn-cta--full"
            >
              {completeLabel(currentSetNumber, totalSets, exerciseIndex, totalExercises)}
            </button>
            <button
              type="button"
              onClick={togglePause}
              className="h-10 px-6 text-[13px] font-medium text-white/45 active:text-white/70 transition-colors"
            >
              {paused ? 'Wznów' : 'Pauza'}
            </button>
          </div>
        </div>
      )}

      {phase === 'rest' && <RestView remaining={restRemaining} onSkip={finishRest} />}
      {phase === 'complete' && frozenDurationRef.current !== null && (
        <CompleteView
          durationSeconds={frozenDurationRef.current}
          exercisesCompleted={totalExercises}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
