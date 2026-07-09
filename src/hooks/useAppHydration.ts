import { useEffect } from 'react';
import { useAppStore, applyTheme } from '../store/appStore';
import { db } from '../services/db';
import type { BodyMeasurement } from '../types';

export function useAppHydration() {
  const { setProfile, setLoading } = useAppStore();

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setLoading(true);
      try {
        const [profile, workouts, measurements, settings] = await Promise.all([
          db.getProfile(),
          db.getWorkouts(),
          db.getMeasurements(),
          db.getSettings(),
        ]);

        if (cancelled) return;

        if (profile) setProfile(profile);

        applyTheme();

        let hydratedMeasurements = measurements.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        if (profile && hydratedMeasurements.length === 0 && profile.weightKg) {
          const seed: BodyMeasurement = {
            date: new Date().toISOString(),
            weightKg: profile.weightKg,
          };
          await db.saveMeasurement(seed);
          hydratedMeasurements = [seed];
        }

        useAppStore.setState({
          workoutSessions: workouts,
          measurements: hydratedMeasurements,
          settings,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [setProfile, setLoading]);
}
