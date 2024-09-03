import { Alert } from 'react-native';
import { CustomProgram } from '@/types/program';
import { Workout } from '@/types/workout';
import { Exercise } from '@/types/exercise';
import { exerciseList } from './exercises';
import { getUnits } from '@/stores/AppStore';

export const handleEditCustomProgram = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Edit Program',
    'What would you like to edit?',
    [
      { text: 'Name', onPress: () => editProgramName(program, customPrograms, saveCustomPrograms) },
      { text: 'Schedule', onPress: () => editProgramSchedule(program, customPrograms, saveCustomPrograms) },
      { text: 'Split', onPress: () => editProgramSplit(program, customPrograms, saveCustomPrograms) },
      { text: 'Workouts', onPress: () => editWorkouts(program, customPrograms, saveCustomPrograms) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

const editProgramName = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.prompt(
    'Edit Program Name',
    'Enter a new name for your program:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        onPress: (newName?: string) => {
          if (newName?.trim()) {
            const updatedProgram = { ...program, name: newName.trim() };
            saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
          } else {
            Alert.alert('Invalid Input', 'Please enter a valid program name.');
          }
        },
      },
    ],
    'plain-text',
    program.name
  );
};

const scheduleOptions = ['3 days/week', '4 days/week', '5 days/week', '6 days/week'];

const editProgramSchedule = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Edit Program Schedule',
    'Select a new schedule:',
    scheduleOptions.map(schedule => ({
      text: schedule,
      onPress: () => {
        const updatedProgram = { ...program, schedule };
        saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
      },
    }))
  );
};

const splitOptions = ['Full Body', 'Upper/Lower', 'Push/Pull/Legs', 'Bro Split'];

const editProgramSplit = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Edit Program Split',
    'Select a new split:',
    splitOptions.map(split => ({
      text: split,
      onPress: () => {
        const updatedProgram = { ...program, split };
        saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
      },
    }))
  );
};

const editWorkouts = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Edit Workouts',
    'What would you like to do?',
    [
      { text: 'Add Workout', onPress: () => addWorkout(program, customPrograms, saveCustomPrograms) },
      { text: 'Edit Existing Workout', onPress: () => selectWorkoutToEdit(program, customPrograms, saveCustomPrograms) },
      { text: 'Delete Workout', onPress: () => selectWorkoutToDelete(program, customPrograms, saveCustomPrograms) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

const addWorkout = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.prompt(
    'Add Workout',
    'Enter a name for the new workout:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add',
        onPress: (workoutName?: string) => {
          if (workoutName?.trim()) {
            const newWorkout: Workout = {
              id: Date.now(),
              name: workoutName.trim(),
              exercises: [],
            };
            const updatedProgram = {
              ...program,
              workouts: [...program.workouts, newWorkout],
            };
            saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
            editWorkout(updatedProgram, newWorkout, customPrograms, saveCustomPrograms);
          } else {
            Alert.alert('Invalid Input', 'Please enter a valid workout name.');
          }
        },
      },
    ],
    'plain-text'
  );
};

const selectWorkoutToEdit = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Select Workout to Edit',
    'Choose a workout:',
    program.workouts.map(workout => ({
      text: workout.name,
      onPress: () => editWorkout(program, workout, customPrograms, saveCustomPrograms),
    }))
  );
};

const selectWorkoutToDelete = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Select Workout to Delete',
    'Choose a workout:',
    program.workouts.map(workout => ({
      text: workout.name,
      onPress: () => confirmDeleteWorkout(program, workout, customPrograms, saveCustomPrograms),
    }))
  );
};

const confirmDeleteWorkout = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Confirm Delete',
    `Are you sure you want to delete the workout "${workout.name}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedProgram = {
            ...program,
            workouts: program.workouts.filter(w => w.id !== workout.id),
          };
          saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
        },
      },
    ]
  );
};

const editWorkout = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Edit Workout',
    'What would you like to do?',
    [
      { text: 'Rename Workout', onPress: () => renameWorkout(program, workout, customPrograms, saveCustomPrograms) },
      { text: 'Add Exercise', onPress: () => addExercise(program, workout, customPrograms, saveCustomPrograms) },
      { text: 'Edit Exercise', onPress: () => selectExerciseToEdit(program, workout, customPrograms, saveCustomPrograms) },
      { text: 'Delete Exercise', onPress: () => selectExerciseToDelete(program, workout, customPrograms, saveCustomPrograms) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

const renameWorkout = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.prompt(
    'Rename Workout',
    'Enter a new name for the workout:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        onPress: (newName?: string) => {
          if (newName?.trim()) {
            const updatedWorkout = { ...workout, name: newName.trim() };
            const updatedProgram = {
              ...program,
              workouts: program.workouts.map(w => w.id === workout.id ? updatedWorkout : w),
            };
            saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
          } else {
            Alert.alert('Invalid Input', 'Please enter a valid workout name.');
          }
        },
      },
    ],
    'plain-text',
    workout.name
  );
};

const addExercise = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  const categories = [...new Set(exerciseList.map(e => e.category))];
  Alert.alert(
    'Select Exercise Category',
    'Choose a category:',
    categories.map(category => ({
      text: category,
      onPress: () => selectExerciseFromCategory(program, workout, category, customPrograms, saveCustomPrograms),
    }))
  );
};

const selectExerciseFromCategory = (
  program: CustomProgram,
  workout: Workout,
  category: string,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  const exercisesInCategory = exerciseList.filter(e => e.category === category);
  Alert.alert(
    'Select Exercise',
    `Choose an exercise from ${category}:`,
    exercisesInCategory.map(exercise => ({
      text: exercise.name,
      onPress: () => promptForExerciseDetails(program, workout, exercise, customPrograms, saveCustomPrograms),
    }))
  );
};

const promptForExerciseDetails = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  promptForSets(program, workout, exercise, customPrograms, saveCustomPrograms);
};

const promptForSets = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  sets?: number
) => {
  const setOptions = [3, 4, 5, 6, 7, 8];
  Alert.alert(
    'Select Sets',
    `Choose the number of sets for ${exercise.name}:`,
    setOptions.map(setCount => ({
      text: setCount.toString(),
      onPress: () => promptForReps(program, workout, exercise, customPrograms, saveCustomPrograms, setCount),
    }))
  );
};

const promptForReps = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  sets: number,
  reps: number = 0
) => {
  Alert.alert(
    'Select Reps',
    `Current reps: ${reps}\nChoose the number of reps for ${exercise.name}:`,
    [
      { text: '-1', onPress: () => promptForReps(program, workout, exercise, customPrograms, saveCustomPrograms, sets, Math.max(0, reps - 1)) },
      { text: '+1', onPress: () => promptForReps(program, workout, exercise, customPrograms, saveCustomPrograms, sets, Math.min(15, reps + 1)) },
      { text: 'Confirm', onPress: () => promptForWeight(program, workout, exercise, customPrograms, saveCustomPrograms, sets, reps) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

interface PlateCount {
  [key: number]: number;
}

const promptForWeight = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  sets: number,
  reps: number,
  currentWeight: number = 100,
  plates: PlateCount = { 45: 1, 25: 0, 10: 1, 5: 0, 2.5: 0 }
) => {
  const units = getUnits();
  const isMetric = units === 'metric';
  const barWeight = isMetric ? 20 : 45; // 20 kg or 45 lbs
  const totalWeight = currentWeight;

  const weightOptions = isMetric
    ? [
        { weight: 20, text: '20 kg plate' },
        { weight: 10, text: '10 kg plate' },
        { weight: 5, text: '5 kg plate' },
        { weight: 2.5, text: '2.5 kg plate' },
        { weight: 1.25, text: '1.25 kg plate' },
      ]
    : [
        { weight: 45, text: '45 lbs plate' },
        { weight: 25, text: '25 lbs plate' },
        { weight: 10, text: '10 lbs plate' },
        { weight: 5, text: '5 lbs plate' },
        { weight: 2.5, text: '2.5 lbs plate' },
      ];

  const unitLabel = isMetric ? 'kg' : 'lbs';
  
  const plateText = Object.entries(plates)
    .filter(([_, count]) => count > 0)
    .map(([weight, count]) => `${count} x ${weight} ${unitLabel}`)
    .join(', ');

  Alert.alert(
    'Select Weight',
    `Current weight: ${totalWeight} ${unitLabel}\nBar: ${barWeight} ${unitLabel}, Plates: ${plateText || 'None'}\nChoose plates to add or remove:`,
    [
      ...weightOptions.map(option => ({
        text: `Add ${option.text}`,
        onPress: () => {
          const newPlates = { ...plates, [option.weight]: (plates[option.weight] || 0) + 1 };
          promptForWeight(program, workout, exercise, customPrograms, saveCustomPrograms, sets, reps, currentWeight + option.weight * 2, newPlates);
        },
      })),
      ...weightOptions.map(option => ({
        text: `Remove ${option.text}`,
        onPress: () => {
          if (plates[option.weight] > 0) {
            const newPlates = { ...plates, [option.weight]: plates[option.weight] - 1 };
            promptForWeight(program, workout, exercise, customPrograms, saveCustomPrograms, sets, reps, currentWeight - option.weight * 2, newPlates);
          } else {
            Alert.alert('Cannot Remove', `There are no ${option.weight} ${unitLabel} plates to remove.`);
          }
        },
      })),
      {
        text: 'Confirm',
        onPress: () => saveExerciseDetails(program, workout, exercise, customPrograms, saveCustomPrograms, sets, reps, totalWeight),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
};

const saveExerciseDetails = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  sets: number,
  reps: number,
  weight: number
) => {
  const newExercise: Exercise = {
    ...exercise,
    sets,
    reps,
    weight,
  };
  const updatedWorkout = {
    ...workout,
    exercises: [...workout.exercises, newExercise],
  };
  const updatedProgram = {
    ...program,
    workouts: program.workouts.map(w => w.id === workout.id ? updatedWorkout : w),
  };
  saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
};

const editExerciseDetails = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  promptForSets(program, workout, exercise, customPrograms, saveCustomPrograms, exercise.sets);
};

const selectExerciseToEdit = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Select Exercise to Edit',
    'Choose an exercise:',
    workout.exercises.map(exercise => ({
      text: `${exercise.name} (${exercise.sets}x${exercise.reps} @ ${exercise.weight}lbs)`,
      onPress: () => editExerciseDetails(program, workout, exercise, customPrograms, saveCustomPrograms),
    }))
  );
};

const selectExerciseToDelete = (
  program: CustomProgram,
  workout: Workout,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Select Exercise to Delete',
    'Choose an exercise:',
    workout.exercises.map(exercise => ({
      text: `${exercise.name} (${exercise.sets}x${exercise.reps} @ ${exercise.weight}lbs)`,
      onPress: () => confirmDeleteExercise(program, workout, exercise, customPrograms, saveCustomPrograms),
    }))
  );
};

const confirmDeleteExercise = (
  program: CustomProgram,
  workout: Workout,
  exercise: Exercise,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  Alert.alert(
    'Confirm Delete',
    `Are you sure you want to delete the exercise "${exercise.name}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedWorkout = {
            ...workout,
            exercises: workout.exercises.filter(e => e.name !== exercise.name),
          };
          const updatedProgram = {
            ...program,
            workouts: program.workouts.map(w => w.id === workout.id ? updatedWorkout : w),
          };
          saveEditedProgram(updatedProgram, customPrograms, saveCustomPrograms);
        },
      },
    ]
  );
};

const saveEditedProgram = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void
) => {
  const updatedPrograms = customPrograms.map(p => p.id === program.id ? program : p);
  saveCustomPrograms(updatedPrograms);
  Alert.alert('Success', 'Your program has been updated.');
};