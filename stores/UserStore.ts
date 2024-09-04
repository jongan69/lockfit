import { ExerciseProgress } from '@/types/exercise';
import { CustomProgram, Program } from '@/types/program';
import { WorkoutData } from '@/types/workout';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  isImperial: boolean;
  workoutData: WorkoutData[];
  customPrograms: CustomProgram[];
  recentActivity: string[];
  exerciseProgress: ExerciseProgress[];
  selectedProgram: Program | CustomProgram | null;
  toggleUnits: () => void;
  setWorkoutData: (data: WorkoutData[]) => void;
  setCustomPrograms: (programs: CustomProgram[]) => void;
  addRecentActivity: (activity: string) => void;
  clearRecentActivity: () => void;
  setExerciseProgress: (progress: ExerciseProgress[]) => void;
  updateExercisePR: (name: string, pr: number) => void;
  setSelectedProgram: (program: Program | CustomProgram | null) => void;
  lastCompletedWeights: Record<string, number>;
  saveWorkoutHistory: (date: string, workout: any) => void;
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
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isImperial: false,
      workoutData: [],
      customPrograms: [],
      recentActivity: [],
      exerciseProgress: [],
      selectedProgram: null,
      toggleUnits: () => set((state) => ({ isImperial: !state.isImperial })),
      setWorkoutData: (data) => set({ workoutData: data }),
      setCustomPrograms: (programs) => set({ customPrograms: programs }),
      addRecentActivity: (activity) => set((state) => {
        const newActivity = [activity, ...state.recentActivity.slice(0, 4)];
        return { recentActivity: newActivity };
      }),
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
      saveWorkoutHistory: (date, workout) => set((state) => ({
        workoutHistory: { ...state.workoutHistory, [date]: workout }
      })),
      workoutHistory: {},
      saveCustomPrograms: (programs) => set({ customPrograms: programs }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
