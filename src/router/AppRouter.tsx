import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Welcome } from '../screens/onboarding/Welcome';
import { Goal } from '../screens/onboarding/Goal';
import { Experience } from '../screens/onboarding/Experience';
import { BodyParams } from '../screens/onboarding/BodyParams';
import { Bands } from '../screens/onboarding/Bands';
import { Availability } from '../screens/onboarding/Availability';
import { Summary } from '../screens/onboarding/Summary';
import { Dashboard } from '../screens/Dashboard';
import { ExerciseLibrary } from '../screens/ExerciseLibrary';
import { Progress } from '../screens/Progress';
import { Profile } from '../screens/Profile';
import { WorkoutDetails } from '../screens/WorkoutDetails';
import { LiveWorkout } from '../screens/LiveWorkout';
import { ExerciseDetail } from '../screens/ExerciseDetail';
import { db } from '../services/db';
import { useAppHydration } from '../hooks/useAppHydration';

function AppRoutes({ initialRoute }: { initialRoute: string }) {
  useAppHydration();

  return (
    <Routes>
      {/* Onboarding (no tab bar) */}
      <Route path="/onboarding" element={<Welcome />} />
      <Route path="/onboarding/goal" element={<Goal />} />
      <Route path="/onboarding/experience" element={<Experience />} />
      <Route path="/onboarding/body" element={<BodyParams />} />
      <Route path="/onboarding/bands" element={<Bands />} />
      <Route path="/onboarding/availability" element={<Availability />} />
      <Route path="/onboarding/summary" element={<Summary />} />

      {/* Workout flow (no tab bar) */}
      <Route path="/workout/:id" element={<WorkoutDetails />} />
      <Route path="/workout/live" element={<LiveWorkout />} />

      {/* Exercise detail (no tab bar) */}
      <Route path="/exercise/:id" element={<ExerciseDetail />} />

      {/* Main app (with tab bar) */}
      <Route element={<MobileLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={initialRoute} replace />} />
    </Routes>
  );
}

export function AppRouter() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    db.getProfile().then((profile) => {
      if (profile?.onboardingCompleted) {
        setInitialRoute('/dashboard');
      } else {
        setInitialRoute('/onboarding');
      }
    });
  }, []);

  if (!initialRoute) {
    return (
      <div className="app-shell items-center justify-center">
        <div className="app-bg" />
        <div className="relative z-10 w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes initialRoute={initialRoute} />
    </BrowserRouter>
  );
}
