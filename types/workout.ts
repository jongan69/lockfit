import { Exercise } from "./exercise";

export interface Workout {
    id: number;
    name: string;
    exercises: Exercise[];
    
}

export interface WorkoutHistoryEntry {
    workout: Workout;
  }

export interface WorkoutTimerProps {
    workout: Workout;
    onComplete: () => void;
  }

export type TimerWorkout = Omit<Workout, 'exercises'> & {
    exercises: (Exercise & {
        duration: number;
        restDuration: number;
    })[];
    reps: number;
    duration: number;
    restDuration: number;
};

export interface WorkoutListProps {
    workouts: Workout[];
    onWorkoutStart: (workout: Workout) => void; // No parameter
    onWorkoutComplete: (workout: CompletedWorkout) => void;
    onEditWorkout: (workout: Workout) => void; // Add this line
  }
  

export interface CompletedWorkout {
  name: string;
  date: string;
  duration: number;
  exercises: {
    name: string;
    sets: {
      reps: number;
      weight: number;
    }[];
  }[];
}

export interface WorkoutData {
    date: string;
    duration: number;
    type: string;
}

