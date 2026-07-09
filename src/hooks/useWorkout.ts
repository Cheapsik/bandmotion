import { useEffect, useState } from 'react';
import type { SuggestedWorkout } from '../data/mockDashboard';
import { getWorkoutById } from '../data/workouts';
import { db } from '../services/db';
import { customWorkoutToSuggested } from '../utils/customWorkout';

export function useWorkout(id?: string) {
  const [workout, setWorkout] = useState<SuggestedWorkout>(() => getWorkoutById(id));
  const [loading, setLoading] = useState(!!id?.startsWith('custom-'));

  useEffect(() => {
    if (!id) {
      setWorkout(getWorkoutById());
      setLoading(false);
      return;
    }

    if (id.startsWith('custom-')) {
      setLoading(true);
      db.getCustomPlan(id).then((plan) => {
        setWorkout(plan ? customWorkoutToSuggested(plan) : getWorkoutById());
        setLoading(false);
      });
      return;
    }

    setWorkout(getWorkoutById(id));
    setLoading(false);
  }, [id]);

  return { workout, loading };
}
