import type { BandLevel } from '../types';

export type WorkoutCategory = 'full_body' | 'upper_body' | 'lower_body' | 'core';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  repsLabel?: string;
  restSecs?: number;
  tempo?: string;
  bandLevel?: BandLevel;
}

export interface SuggestedWorkout {
  id: string;
  name: string;
  category: WorkoutCategory;
  categoryLabel: string;
  durationMinutes: number;
  exerciseCount: number;
  exercises: WorkoutExercise[];
}

/** Statyczne dane testowe — Faza 3 */
export const SUGGESTED_WORKOUT: SuggestedWorkout = {
  id: 'today-full-body',
  name: 'Full Body',
  category: 'full_body',
  categoryLabel: 'Całe ciało',
  durationMinutes: 25,
  exerciseCount: 6,
  exercises: [
    { id: '1', name: 'Band Squat', sets: 3, reps: 12 },
    { id: '2', name: 'Band Chest Press', sets: 3, reps: 10 },
    { id: '3', name: 'Band Row', sets: 3, reps: 12 },
    { id: '4', name: 'Band Glute Bridge', sets: 3, reps: 15 },
    { id: '5', name: 'Band Lateral Walk', sets: 2, reps: 20 },
    { id: '6', name: 'Band Pallof Press', sets: 3, reps: 10 },
  ],
};


export const DAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const;

export function getCurrentWeekDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}
