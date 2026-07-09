import type { BandLevel } from '../types';
import type { SuggestedWorkout } from '../data/mockDashboard';
import { getExerciseById } from '../data/exercises';

export interface PlanExerciseConfig {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSecs: number;
  tempo: string;
  bandLevel: BandLevel;
}

export function parseReps(reps: string): number {
  const match = reps.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

export function configsFromWorkout(workout: SuggestedWorkout): PlanExerciseConfig[] {
  return workout.exercises.map((ex) => {
    const dbEx = getExerciseById(ex.id);
    return {
      exerciseId: ex.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.repsLabel ?? dbEx?.defaultReps ?? String(ex.reps),
      restSecs: ex.restSecs ?? dbEx?.defaultRestSecs ?? 60,
      tempo: ex.tempo ?? dbEx?.tempo ?? '2-1-2',
      bandLevel: ex.bandLevel ?? dbEx?.bandLevel ?? 'medium',
    };
  });
}

export function configsToSuggestedWorkout(
  base: SuggestedWorkout,
  configs: PlanExerciseConfig[],
): SuggestedWorkout {
  const exercises = configs.map((c) => ({
    id: c.exerciseId,
    name: c.name,
    sets: c.sets,
    reps: parseReps(c.reps),
    repsLabel: c.reps,
    restSecs: c.restSecs,
    tempo: c.tempo,
    bandLevel: c.bandLevel,
  }));

  const workMinutes = configs.reduce(
    (sum, c) => sum + c.sets * 2 + Math.ceil(c.restSecs / 60) * Math.max(0, c.sets - 1),
    0,
  );

  return {
    ...base,
    exerciseCount: exercises.length,
    durationMinutes: Math.max(10, workMinutes),
    exercises,
  };
}

export const BAND_LEVEL_LABELS: Record<BandLevel, string> = {
  light: 'Lekka',
  medium: 'Średnia',
  heavy: 'Ciężka',
  any: 'Dowolna',
};

export const REST_OPTIONS = [30, 45, 60, 75, 90, 120] as const;
