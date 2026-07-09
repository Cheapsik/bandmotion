import { create } from 'zustand';
import type { AppSettings, UserProfile, WorkoutSession, BodyMeasurement } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { db } from '../services/db';

const DEFAULT_DRAFT: Partial<UserProfile> = {
  gender: 'Wolę nie podawać',
  age: 30,
  heightCm: 170,
  weightKg: 70,
  bands: [],
  onboardingCompleted: false,
};

function applyDarkMode(dark: boolean) {
  document.documentElement.classList.toggle('light', !dark);
}

/** Force cinematic theme on by default — ignore stale light setting for now */
export function applyTheme() {
  document.documentElement.classList.remove('light');
}

interface AppState {
  profile: UserProfile | null;
  draftProfile: Partial<UserProfile>;
  workoutSessions: WorkoutSession[];
  measurements: BodyMeasurement[];
  settings: AppSettings;
  isLoading: boolean;

  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
  updateDraft: (partial: Partial<UserProfile>) => void;
  resetDraft: () => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  addMeasurement: (measurement: BodyMeasurement) => Promise<void>;
  setSettings: (settings: AppSettings) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  draftProfile: { ...DEFAULT_DRAFT },
  workoutSessions: [],
  measurements: [],
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  setProfile: (profile) => set({ profile }),

  updateProfile: async (partial) => {
    const current = get().profile;
    if (!current) return;
    const updated = { ...current, ...partial };
    await db.saveProfile(updated);
    set({ profile: updated });
  },

  updateDraft: (partial) =>
    set((state) => ({ draftProfile: { ...state.draftProfile, ...partial } })),

  resetDraft: () => set({ draftProfile: { ...DEFAULT_DRAFT } }),

  addWorkoutSession: (session) =>
    set((state) => ({ workoutSessions: [...state.workoutSessions, session] })),

  addMeasurement: async (measurement) => {
    await db.saveMeasurement(measurement);
    set((state) => ({
      measurements: [...state.measurements, measurement].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    }));
  },

  setSettings: async (settings) => {
    await db.saveSettings(settings);
    applyTheme();
    set({ settings });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

export { applyDarkMode };
