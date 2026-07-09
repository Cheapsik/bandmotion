import type { WorkoutSession } from '../types';
import { WORKOUT_TYPE_LABELS } from '../data/profileLabels';

export function getWorkoutsInMonth(
  sessions: WorkoutSession[],
  year: number,
  month: number,
): WorkoutSession[] {
  return sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getWorkoutDaysInMonth(
  sessions: WorkoutSession[],
  year: number,
  month: number,
): Set<number> {
  const days = new Set<number>();
  for (const s of sessions) {
    const d = new Date(s.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      days.add(d.getDate());
    }
  }
  return days;
}

export function getMostCommonWorkoutType(sessions: WorkoutSession[]): string | null {
  if (sessions.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const s of sessions) {
    counts[s.workoutType] = (counts[s.workoutType] ?? 0) + 1;
  }

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? WORKOUT_TYPE_LABELS[top[0]] ?? top[0] : null;
}
