import type { CustomWorkout } from '../types';
import type { SuggestedWorkout } from '../data/mockDashboard';
import { getExerciseById } from '../data/exercises';
import { parseReps } from './workoutConfig';

export function customWorkoutToSuggested(plan: CustomWorkout): SuggestedWorkout {
  const exercises = plan.exercises.map((entry) => {
    const ex = getExerciseById(entry.exerciseId);
    return {
      id: entry.exerciseId,
      name: ex?.name ?? entry.exerciseId,
      sets: entry.sets,
      reps: parseReps(entry.reps),
      repsLabel: entry.reps,
      restSecs: entry.restSecs,
      tempo: entry.tempo,
      bandLevel: entry.bandLevel,
    };
  });

  return {
    id: plan.id,
    name: plan.name,
    category: 'full_body',
    categoryLabel: 'Własny plan',
    durationMinutes: Math.max(10, exercises.length * 4),
    exerciseCount: exercises.length,
    exercises,
  };
}

export function estimatePlanDuration(exerciseCount: number): number {
  return Math.max(10, exerciseCount * 4);
}
