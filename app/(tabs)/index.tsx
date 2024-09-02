import { View, Text, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import WorkoutList from '../../components/WorkoutList'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const Home = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);
  const navigation = useNavigation();
  
  const customPrograms = useSelector((state: RootState) => state.program.customPrograms);
  const recentActivity = useSelector((state: RootState) => state.user.recentActivity);

  const handleWorkoutStart = useCallback(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  const handleWorkoutComplete = useCallback(() => {
    navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity, index) => (
          <Text key={index} style={styles.activityItem}>{activity}</Text>
        ))}
      </View>
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>Your Programs</Text>
        <WorkoutList 
          workouts={customPrograms as any}
          onWorkoutStart={handleWorkoutStart}
          onWorkoutComplete={handleWorkoutComplete}
        />
      </View>
    </ScrollView>
  )
}

export default Home