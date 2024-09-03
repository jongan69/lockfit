import { Alert } from 'react-native';
import { CustomProgram } from '@/types/program';
import { exerciseList } from './exercises';

export const handleCreateCustomProgram = (
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  onProgramCreated: (program: CustomProgram) => void
) => {
  promptForName(customPrograms, saveCustomPrograms, onProgramCreated);
};

const promptForName = (
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  onProgramCreated: (program: CustomProgram) => void
) => {
  Alert.prompt(
    'Create Custom Program',
    'Enter a name for your custom program:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: (name?: string) => {
          if (name && name.trim()) {
            createProgram(name.trim(), customPrograms, saveCustomPrograms, onProgramCreated);
          } else {
            Alert.alert('Invalid Input', 'Please enter a valid program name.', [
              { text: 'Retry', onPress: () => promptForName(customPrograms, saveCustomPrograms, onProgramCreated) }
            ]);
          }
        },
      },
    ],
    'plain-text'
  );
};

const createProgram = (
  name: string,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  onProgramCreated: (program: CustomProgram) => void
) => {
  const newProgram: CustomProgram = {
    id: Date.now(),
    name,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    schedule: '3 days/week', // Default schedule
    split: 'Full Body', // Default split
    workouts: [
      {
        id: Date.now(),
        name: 'Workout A',
        exercises: [
          { ...exerciseList.find(e => e.name === 'Squat')!, sets: 3, reps: 5, weight: 100 },
          { ...exerciseList.find(e => e.name === 'Bench Press')!, sets: 3, reps: 5, weight: 100 },
          { ...exerciseList.find(e => e.name === 'Deadlift')!, sets: 3, reps: 5, weight: 100 },
        ],
      },
    ],
  };

  saveProgram(newProgram, customPrograms, saveCustomPrograms, onProgramCreated);
};

const saveProgram = (
  program: CustomProgram,
  customPrograms: CustomProgram[],
  saveCustomPrograms: (programs: CustomProgram[]) => void,
  onProgramCreated: (program: CustomProgram) => void
) => {
  const updatedPrograms = [...customPrograms, program];
  saveCustomPrograms(updatedPrograms);
  onProgramCreated(program);
  Alert.alert('Success', 'Your custom program has been created and saved. You can now edit it for full customization.');
};