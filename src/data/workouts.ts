import type { SuggestedWorkout, WorkoutCategory } from './mockDashboard';
import { SUGGESTED_WORKOUT } from './mockDashboard';
import { READY_WORKOUT_CATEGORIES } from './readyWorkouts';

const UPPER_BODY: SuggestedWorkout = {
  id: 'ready-upper',
  name: 'Górna część',
  category: 'upper_body',
  categoryLabel: 'Klatka, plecy, barki',
  durationMinutes: 20,
  exerciseCount: 5,
  exercises: [
    { id: 'u1', name: 'Band Chest Press', sets: 3, reps: 12 },
    { id: 'u2', name: 'Band Row', sets: 3, reps: 12 },
    { id: 'u3', name: 'Band Shoulder Press', sets: 3, reps: 10 },
    { id: 'u4', name: 'Band Face Pull', sets: 3, reps: 15 },
    { id: 'u5', name: 'Band Biceps Curl', sets: 2, reps: 12 },
  ],
};

const LOWER_BODY: SuggestedWorkout = {
  id: 'ready-lower',
  name: 'Dolna część',
  category: 'lower_body',
  categoryLabel: 'Nogi i pośladki',
  durationMinutes: 20,
  exerciseCount: 5,
  exercises: [
    { id: 'l1', name: 'Band Squat', sets: 3, reps: 15 },
    { id: 'l2', name: 'Band Glute Bridge', sets: 3, reps: 15 },
    { id: 'l3', name: 'Band Lateral Walk', sets: 2, reps: 20 },
    { id: 'l4', name: 'Band Leg Press', sets: 3, reps: 12 },
    { id: 'l5', name: 'Band Calf Raise', sets: 3, reps: 15 },
  ],
};

const CORE: SuggestedWorkout = {
  id: 'ready-core',
  name: 'Core',
  category: 'core',
  categoryLabel: 'Brzuch i stabilizacja',
  durationMinutes: 15,
  exerciseCount: 4,
  exercises: [
    { id: 'c1', name: 'Band Pallof Press', sets: 3, reps: 10 },
    { id: 'c2', name: 'Band Woodchop', sets: 3, reps: 12 },
    { id: 'c3', name: 'Band Dead Bug', sets: 3, reps: 10 },
    { id: 'c4', name: 'Band Plank Pull', sets: 2, reps: 15 },
  ],
};

const FULL_BODY_READY: SuggestedWorkout = {
  ...SUGGESTED_WORKOUT,
  id: 'ready-full-body',
};

export const WORKOUTS: Record<string, SuggestedWorkout> = {
  [SUGGESTED_WORKOUT.id]: SUGGESTED_WORKOUT,
  [FULL_BODY_READY.id]: FULL_BODY_READY,
  [UPPER_BODY.id]: UPPER_BODY,
  [LOWER_BODY.id]: LOWER_BODY,
  [CORE.id]: CORE,
};

export function getWorkoutById(id?: string): SuggestedWorkout {
  if (id && WORKOUTS[id]) return WORKOUTS[id];

  const ready = READY_WORKOUT_CATEGORIES.find((c) => c.id === id);
  if (ready && WORKOUTS[ready.id]) return WORKOUTS[ready.id];

  return SUGGESTED_WORKOUT;
}

export function workoutTypeFromCategory(
  category: WorkoutCategory,
): 'full_body' | 'single_exercise' | 'category_based' {
  if (category === 'full_body') return 'full_body';
  return 'category_based';
}

export const REST_SECONDS = 60;

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
