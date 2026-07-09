export type Goal = 'weight_loss' | 'strength' | 'endurance' | 'mobility';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingDays = '2-3' | '4-5' | 'daily';
export type SessionDuration = '10-15' | '20-30' | '30plus';
export type BandSource = 'preset' | 'custom';

export interface Band {
  id: string;
  label: string;
  source: BandSource;
  minResistanceKg?: number;
  maxResistanceKg?: number;
}

export interface UserProfile {
  goal: Goal;
  experienceLevel: ExperienceLevel;
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  bands: Band[];
  trainingDaysPerWeek: TrainingDays;
  sessionDurationMinutes: SessionDuration;
  onboardingCompleted: boolean;
}

export interface ExerciseLogEntry {
  exerciseId: string;
  setsCompleted: number;
  repsPerSet: number[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutType: 'full_body' | 'single_exercise' | 'category_based';
  durationSeconds: number;
  exercisesCompleted: ExerciseLogEntry[];
}

export interface BodyMeasurement {
  date: string;
  weightKg: number;
  waistCm?: number;
  hipsCm?: number;
  armCm?: number;
}

// ── Exercise library ──────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'glutes' | 'core' | 'full_body' | 'mobility' | 'warmup';

export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseType = 'push' | 'pull' | 'hinge' | 'squat' | 'carry' | 'core' | 'mobility';
export type BandLevel = 'light' | 'medium' | 'heavy' | 'any';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  level: ExerciseLevel;
  type: ExerciseType;
  bandLevel: BandLevel;
  defaultSets: number;
  defaultReps: string;
  defaultRestSecs: number;
  tempo: string;
  instructions: string;
  tips: string[];
  commonMistakes: string[];
  favorite?: boolean;
}

export interface CustomWorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSecs: number;
  tempo: string;
  bandLevel: BandLevel;
}

export interface CustomWorkout {
  id: string;
  name: string;
  createdAt: string;
  exercises: CustomWorkoutExercise[];
}

// ─────────────────────────────────────────────────────────────────────────────

export type WeightUnit = 'kg' | 'lb';
export type LengthUnit = 'cm' | 'inch';

export interface AppSettings {
  weightUnit: WeightUnit;
  lengthUnit: LengthUnit;
  darkMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'kg',
  lengthUnit: 'cm',
  darkMode: true,
};
