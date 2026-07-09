import { openDB, type IDBPDatabase } from 'idb';
import type { AppSettings, BodyMeasurement, CustomWorkout, UserProfile, WorkoutSession } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const DB_NAME = 'bandmotion';
const DB_VERSION = 4;

type BandMotionDB = {
  profile: {
    key: 'data';
    value: UserProfile;
  };
  workouts: {
    key: string;
    value: WorkoutSession;
    indexes: { 'by-date': string };
  };
  measurements: {
    key: string;
    value: BodyMeasurement & { id: string };
    indexes: { 'by-date': string };
  };
  settings: {
    key: 'app';
    value: AppSettings;
  };
  customPlans: {
    key: string;
    value: CustomWorkout;
    indexes: { 'by-date': string };
  };
};

let dbPromise: Promise<IDBPDatabase<BandMotionDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BandMotionDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile');
        }
        if (!db.objectStoreNames.contains('workouts')) {
          const ws = db.createObjectStore('workouts', { keyPath: 'id' });
          ws.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('measurements')) {
          const ms = db.createObjectStore('measurements', { keyPath: 'id' });
          ms.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('customPlans')) {
          const cp = db.createObjectStore('customPlans', { keyPath: 'id' });
          cp.createIndex('by-date', 'createdAt');
        }

        if (oldVersion < 3) {
          const legacyDb = db as unknown as IDBDatabase;
          for (const store of ['exercises', 'meta']) {
            if (legacyDb.objectStoreNames.contains(store)) {
              legacyDb.deleteObjectStore(store);
            }
          }
        }
      },
    });
  }
  return dbPromise;
}

export const db = {
  async getProfile(): Promise<UserProfile | undefined> {
    const database = await getDB();
    return database.get('profile', 'data');
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    const database = await getDB();
    await database.put('profile', profile, 'data');
  },

  async getWorkouts(): Promise<WorkoutSession[]> {
    const database = await getDB();
    return database.getAll('workouts');
  },

  async saveWorkout(session: WorkoutSession): Promise<void> {
    const database = await getDB();
    await database.put('workouts', session);
  },

  async getMeasurements(): Promise<BodyMeasurement[]> {
    const database = await getDB();
    const all = await database.getAll('measurements');
    return all.map(({ id: _id, ...rest }) => rest as BodyMeasurement);
  },

  async saveMeasurement(measurement: BodyMeasurement): Promise<void> {
    const database = await getDB();
    const id = measurement.date + '_' + Math.random().toString(36).slice(2);
    await database.put('measurements', { ...measurement, id });
  },

  async getSettings(): Promise<AppSettings> {
    const database = await getDB();
    const settings = await database.get('settings', 'app');
    return settings ?? DEFAULT_SETTINGS;
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    const database = await getDB();
    await database.put('settings', settings, 'app');
  },

  async getCustomPlans(): Promise<CustomWorkout[]> {
    const database = await getDB();
    const plans = await database.getAll('customPlans');
    return plans.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getCustomPlan(id: string): Promise<CustomWorkout | undefined> {
    const database = await getDB();
    return database.get('customPlans', id);
  },

  async saveCustomPlan(plan: CustomWorkout): Promise<void> {
    const database = await getDB();
    await database.put('customPlans', plan);
  },

  async deleteCustomPlan(id: string): Promise<void> {
    const database = await getDB();
    await database.delete('customPlans', id);
  },
};
