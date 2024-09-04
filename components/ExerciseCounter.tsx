import { useUserStore } from '@/stores/UserStore';
import React from 'react';
import { View, Text } from 'react-native';

interface ExerciseCounterProps {
  exercise: { name: string };
  initialWeight: number;
}

const ExerciseCounter: React.FC<ExerciseCounterProps> = ({ exercise, initialWeight }) => {
  const { isImperial } = useUserStore();
  const units = isImperial ? 'lbs' : 'kg';

  return (
    <View>
      <Text>{exercise.name}: {initialWeight} {units}</Text>
    </View>
  );
};

export default ExerciseCounter;