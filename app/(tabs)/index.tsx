import { View } from 'react-native'
import React, { useCallback } from 'react'
import WorkoutList from '../../components/WorkoutList'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);
  const navigation = useNavigation();
  
  // Updated sample workout data
  const workouts = [
    { name: 'Bench Press', sets: 3, reps: 10, weight: 80, duration: 30, restDuration: 60 },
    { name: 'Squats', sets: 4, reps: 8, weight: 100, duration: 40, restDuration: 90 },
    { name: 'Deadlifts', sets: 3, reps: 5, weight: 120, duration: 35, restDuration: 120 },
  ];

  const handleWorkoutStart = useCallback(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  const handleWorkoutComplete = useCallback(() => {
    navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <WorkoutList 
        workouts={workouts} 
        onWorkoutStart={handleWorkoutStart}
        onWorkoutComplete={handleWorkoutComplete}
      />
    </View>
  )
}

export default Home