import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useCompletedWorkouts } from '@/hooks/useCompletedWorkouts';

const CompletedWorkoutsList = () => {
  const completedWorkouts = useCompletedWorkouts();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {completedWorkouts.map((workout: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; date: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; duration: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; exercises: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; sets: string | any[]; }[]; }, index: React.Key | null | undefined) => (
        <View key={index} style={styles.workoutCard}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDate}>{workout.date}</Text>
          <Text style={styles.workoutDuration}>Duration: {workout.duration} mins</Text>
          {workout.exercises.map((exercise: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; sets: string | any[]; }, exerciseIndex: React.Key | null | undefined) => (
            <View key={exerciseIndex}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.workoutDetails}>
                Sets: {exercise.sets.length} x Reps: {exercise.sets[0].reps}
              </Text>
              <Text style={styles.workoutWeight}>
                Weight: {exercise.sets[0].weight} lbs
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  workoutCard: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutDate: {
    fontSize: 14,
    marginBottom: 3,
  },
  workoutDuration: {
    fontSize: 14,
    marginBottom: 3,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  workoutDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  workoutWeight: {
    fontSize: 14,
  },
});

export default CompletedWorkoutsList;