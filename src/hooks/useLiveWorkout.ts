import { useCallback, useMemo, useState } from 'react';
import type { ExerciseLogEntry } from '../types';
import type { SuggestedWorkout } from '../data/mockDashboard';
import { REST_SECONDS } from '../data/workouts';

export type LivePhase = 'active' | 'rest' | 'complete';

interface ExerciseLog {
  setsCompleted: number;
  repsPerSet: number[];
}

export function useLiveWorkout(workout: SuggestedWorkout) {
  const [phase, setPhase] = useState<LivePhase>('active');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [log, setLog] = useState<Record<string, ExerciseLog>>({});

  const currentExercise = workout.exercises[exerciseIndex];
  const totalExercises = workout.exercises.length;
  const currentSetNumber = setIndex + 1;
  const totalSets = currentExercise?.sets ?? 0;
  const restSeconds = currentExercise?.restSecs ?? REST_SECONDS;

  const logSet = useCallback(
    (exerciseId: string, reps: number) => {
      setLog((prev) => {
        const existing = prev[exerciseId] ?? { setsCompleted: 0, repsPerSet: [] };
        return {
          ...prev,
          [exerciseId]: {
            setsCompleted: existing.setsCompleted + 1,
            repsPerSet: [...existing.repsPerSet, reps],
          },
        };
      });
    },
    [],
  );

  const completeSet = useCallback(() => {
    if (!currentExercise) return;

    logSet(currentExercise.id, currentExercise.reps);

    const isLastSet = setIndex + 1 >= currentExercise.sets;
    const isLastExercise = exerciseIndex + 1 >= totalExercises;

    if (isLastSet && isLastExercise) {
      setPhase('complete');
      return;
    }

    setPhase('rest');
  }, [currentExercise, exerciseIndex, logSet, setIndex, totalExercises]);

  const finishRest = useCallback(() => {
    if (!currentExercise) return;

    const isLastSet = setIndex + 1 >= currentExercise.sets;

    if (isLastSet) {
      setExerciseIndex((i) => i + 1);
      setSetIndex(0);
    } else {
      setSetIndex((s) => s + 1);
    }

    setPhase('active');
  }, [currentExercise, setIndex]);

  const exerciseLogEntries: ExerciseLogEntry[] = useMemo(
    () =>
      Object.entries(log).map(([exerciseId, entry]) => ({
        exerciseId,
        setsCompleted: entry.setsCompleted,
        repsPerSet: entry.repsPerSet,
      })),
    [log],
  );

  return {
    phase,
    exerciseIndex,
    setIndex,
    currentExercise,
    currentSetNumber,
    totalSets,
    totalExercises,
    exerciseLogEntries,
    restSeconds,
    completeSet,
    finishRest,
  };
}
