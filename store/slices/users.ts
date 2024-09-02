import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutData {
  date: string;
  duration: number;
  type: string;
}

interface Exercise {
  name: string;
  reps: number;
  sets: number;
  weight?: number;
}

interface CustomProgram {
  id: number;
  name: string;
  color: string;
  exercises: Exercise[];
}

interface ExerciseProgress {
  name: string;
  pr: number;
  data: number[];
}

interface UserState {
  publicKey: string;
  isImperial: boolean;
  currentBalance: number;
  stakedBalance: number;
  rewardsBalance: number;
  timeStaked: number;
  workoutData: WorkoutData[];
  customPrograms: CustomProgram[];
  recentActivity: string[];
  exerciseProgress: ExerciseProgress[];
  selectedProgram: CustomProgram | null;
}

const initialState: UserState = {
  publicKey: '',
  isImperial: false,
  currentBalance: 0,
  stakedBalance: 0,
  rewardsBalance: 0,
  timeStaked: 0,
  workoutData: [],
  customPrograms: [],
  recentActivity: [],
  exerciseProgress: [],
  selectedProgram: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    clearPublicKey: (state) => {
      state.publicKey = '';
    },
    toggleUnits: (state) => {
      state.isImperial = !state.isImperial;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.currentBalance = action.payload;
    },
    updateStakedBalance: (state, action: PayloadAction<number>) => {
      state.stakedBalance = action.payload;
    },
    updateRewardsBalance: (state, action: PayloadAction<number>) => {
      state.rewardsBalance = action.payload;
    },
    updateTimeStaked: (state, action: PayloadAction<number>) => {
      state.timeStaked = action.payload;
    },
    setWorkoutData: (state, action: PayloadAction<WorkoutData[]>) => {
      state.workoutData = action.payload;
    },
    setCustomPrograms: (state, action: PayloadAction<CustomProgram[]>) => {
      state.customPrograms = action.payload;
    },
    addRecentActivity: (state, action: PayloadAction<string>) => {
      state.recentActivity.unshift(action.payload);
      if (state.recentActivity.length > 5) {
        state.recentActivity.pop();
      }
    },
    clearRecentActivity: (state) => {
      state.recentActivity = [];
    },
    setExerciseProgress: (state, action: PayloadAction<ExerciseProgress[]>) => {
      state.exerciseProgress = action.payload;
    },
    updateExercisePR: (state, action: PayloadAction<{ name: string; pr: number }>) => {
      const exercise = state.exerciseProgress.find(e => e.name === action.payload.name);
      if (exercise) {
        exercise.pr = action.payload.pr;
        exercise.data.push(action.payload.pr);
      }
    },
    setSelectedProgram: (state, action: PayloadAction<CustomProgram | null>) => {
      state.selectedProgram = action.payload;
    },
  },
});

export const { 
  setPublicKey, 
  clearPublicKey, 
  toggleUnits, 
  updateBalance, 
  updateStakedBalance, 
  updateRewardsBalance, 
  updateTimeStaked, 
  setWorkoutData, 
  setCustomPrograms,
  addRecentActivity,
  clearRecentActivity,
  setExerciseProgress,
  updateExercisePR,
  setSelectedProgram
} = userSlice.actions;
export default userSlice.reducer;