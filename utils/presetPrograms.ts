import { Exercise } from "@/types/exercise";
import { Program } from "@/types/program";
import { exerciseList } from "./exercises";

export const presetPrograms: Program[] = [
    {
      id: 1,
      name: 'StrongLifts 5x5',
      color: '#FF6B6B',
      workouts: [
        {
          id: 1,
          name: 'Workout A',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Bench Press'),
            exerciseList.find(e => e.name === 'Barbell Row'),
          ].filter(Boolean) as Exercise[]
        },
        {
          id: 2,
          name: 'Workout B',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Overhead Press'),
            exerciseList.find(e => e.name === 'Deadlift'),
          ].filter(Boolean) as Exercise[]
        }
      ],
      schedule: '3 days/week',
      split: 'Full Body',
    },
    {
      id: 2,
      name: 'Starting Strength',
      color: '#4ECDC4',
      workouts: [
        {
          id: 1,
          name: 'Workout A',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Bench Press'),
            exerciseList.find(e => e.name === 'Deadlift'),
          ].filter(Boolean) as Exercise[]
        },
        {
          id: 2,
          name: 'Workout B',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Overhead Press'),
            exerciseList.find(e => e.name === 'Power Clean'),
          ].filter(Boolean) as Exercise[]
        }
      ],
      schedule: '3 days/week',
      split: 'Full Body',
    },
    {
      id: 3,
      name: 'Madcow 5x5',
      color: '#45B7D1',
      workouts: [
        {
          id: 1,
          name: 'Monday',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Bench Press'),
            exerciseList.find(e => e.name === 'Barbell Row'),
          ].filter(Boolean) as Exercise[]
        },
        {
          id: 2,
          name: 'Wednesday',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Overhead Press'),
            exerciseList.find(e => e.name === 'Deadlift'),
          ].filter(Boolean) as Exercise[]
        },
        {
          id: 3,
          name: 'Friday',
          exercises: [
            exerciseList.find(e => e.name === 'Squat'),
            exerciseList.find(e => e.name === 'Bench Press'),
            exerciseList.find(e => e.name === 'Barbell Row'),
          ].filter(Boolean) as Exercise[]
        }
      ],
      schedule: '3 days/week',
      split: 'Full Body',
    },
  ]