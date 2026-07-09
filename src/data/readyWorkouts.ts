import type { WorkoutCategory } from './mockDashboard';

export interface ReadyWorkoutCategory {
  id: string;
  category: WorkoutCategory;
  label: string;
  description: string;
  durationMinutes: number;
  exerciseCount: number;
  bodyPartFilters: string[];
}

export const READY_WORKOUT_CATEGORIES: ReadyWorkoutCategory[] = [
  {
    id: 'ready-full-body',
    category: 'full_body',
    label: 'Full Body',
    description: 'Całe ciało',
    durationMinutes: 30,
    exerciseCount: 7,
    bodyPartFilters: [],
  },
  {
    id: 'ready-upper',
    category: 'upper_body',
    label: 'Upper',
    description: 'Klatka, plecy, barki',
    durationMinutes: 25,
    exerciseCount: 6,
    bodyPartFilters: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  },
  {
    id: 'ready-lower',
    category: 'lower_body',
    label: 'Lower',
    description: 'Nogi i pośladki',
    durationMinutes: 25,
    exerciseCount: 6,
    bodyPartFilters: ['legs', 'glutes'],
  },
  {
    id: 'ready-push',
    category: 'full_body',
    label: 'Push',
    description: 'Klatka, barki, triceps',
    durationMinutes: 20,
    exerciseCount: 5,
    bodyPartFilters: ['chest', 'shoulders', 'triceps'],
  },
  {
    id: 'ready-pull',
    category: 'full_body',
    label: 'Pull',
    description: 'Plecy, biceps',
    durationMinutes: 20,
    exerciseCount: 5,
    bodyPartFilters: ['back', 'biceps'],
  },
  {
    id: 'ready-core',
    category: 'core',
    label: 'Core',
    description: 'Brzuch i stabilizacja',
    durationMinutes: 15,
    exerciseCount: 5,
    bodyPartFilters: ['core'],
  },
  {
    id: 'ready-mobility',
    category: 'full_body',
    label: 'Mobility',
    description: 'Mobilność i rozciąganie',
    durationMinutes: 15,
    exerciseCount: 6,
    bodyPartFilters: ['mobility', 'warmup'],
  },
];
