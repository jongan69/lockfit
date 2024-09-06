import { ExerciseProgress } from '@/types/exercise';
import { CustomProgram, Program } from '@/types/program';
import { WorkoutData, CompletedWorkout } from '@/types/workout';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase } from 'expo-sqlite';

interface UserState {
  isImperial: boolean;
  workoutData: WorkoutData[];
  customPrograms: CustomProgram[];
  recentActivity: string[];
  exerciseProgress: ExerciseProgress[];
  selectedProgram: Program | CustomProgram | null;
  toggleUnits: (db: SQLiteDatabase) => void;
  setWorkoutData: (data: WorkoutData[]) => void;
  setCustomPrograms: (programs: CustomProgram[]) => void;
  addRecentActivity: (db: SQLiteDatabase, activity: string) => void;
  clearRecentActivity: () => void;
  setExerciseProgress: (progress: ExerciseProgress[]) => void;
  updateExercisePR: (name: string, pr: number) => void;
  setSelectedProgram: (program: Program | CustomProgram | null) => void;
  lastCompletedWeights: Record<string, number>;
  saveWorkoutHistory: (db: SQLiteDatabase, date: string, workout: any) => void;
  workoutHistory: {
    [date: string]: {
      workout: {
        name: string;
        exercises: {
          name: string;
          sets: {
            weight: number;
            unit: string;
            reps: number;
          }[];
        }[];
      };
    };
  };
  saveCustomPrograms: (programs: CustomProgram[]) => void;
  loadPreferences: (db: SQLiteDatabase) => void;
}

const savePreference = async (db: SQLiteDatabase, key: string, value: string) => {
  await db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', [key, value]);
};

const getPreference = async (db: SQLiteDatabase, key: string): Promise<string | null> => {
  const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', [key]);
  return result?.value ?? null;
};

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      isImperial: false,
      workoutData: [],
      customPrograms: [],
      recentActivity: [],
      exerciseProgress: [],
      selectedProgram: null,
      toggleUnits: async (db: SQLiteDatabase) => {
        const newIsImperial = !get().isImperial;
        set({ isImperial: newIsImperial });
        await savePreference(db, 'isImperial', newIsImperial.toString());
      },
      setWorkoutData: (data) => set({ workoutData: data }),
      setCustomPrograms: (programs) => set({ customPrograms: programs }),
      addRecentActivity: async (db: SQLiteDatabase, activity: string) => {
        const newActivity = [activity, ...get().recentActivity.slice(0, 4)];
        set({ recentActivity: newActivity });
        await savePreference(db, 'recentActivity', JSON.stringify(newActivity));
      },
      clearRecentActivity: () => set({ recentActivity: [] }),
      setExerciseProgress: (progress) => set({ exerciseProgress: progress }),
      updateExercisePR: (name, pr) => set((state) => ({
        exerciseProgress: state.exerciseProgress.map((exercise) =>
          exercise.name === name
            ? { ...exercise, pr, data: [...exercise.data, pr] }
            : exercise
        ),
      })),
      setSelectedProgram: (program) => set({ selectedProgram: program }),
      lastCompletedWeights: {},
      saveWorkoutHistory: async (db: SQLiteDatabase, date, workout) => {
        const newHistory = { ...get().workoutHistory, [date]: workout };
        set({ workoutHistory: newHistory });
        await savePreference(db, 'workoutHistory', JSON.stringify(newHistory));
      },
      workoutHistory: {},
      saveCustomPrograms: (programs) => set({ customPrograms: programs }),
      loadPreferences: async (db: SQLiteDatabase) => {
        const isImperial = await getPreference(db, 'isImperial');
        const recentActivity = await getPreference(db, 'recentActivity');
        const workoutHistory = await getPreference(db, 'workoutHistory');
        set({
          isImperial: isImperial === 'true',
          recentActivity: recentActivity ? JSON.parse(recentActivity) : [],
          workoutHistory: workoutHistory ? JSON.parse(workoutHistory) : {},
        });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
