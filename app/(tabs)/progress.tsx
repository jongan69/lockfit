import React, { useRef } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import { LineChart } from 'react-native-chart-kit'
import { useTabBarVisibility } from '../../contexts/TabBarVisibilityContext'
import { handleScroll } from '@/utils/handleScroll'
import { useUserStore } from '../../stores/UserStore'

const Progress = () => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode ?? false;
  const styles = createThemedStyles(isDarkMode);
  const { setTabBarVisible } = useTabBarVisibility() ?? {};
  const scrollViewRef = useRef(null);
  const { exerciseProgress } = useUserStore();

  const totalBigThree = exerciseProgress
    .filter(e => ['Squat', 'Bench Press', 'Deadlift'].includes(e.name))
    .reduce((sum, e) => sum + e.pr, 0);

  const renderExerciseCard = (exercise: any) => (
    <View key={exercise.name} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{exercise.name}</Text>
        <Text style={styles.cardPR}>{exercise.pr} lbs</Text>
      </View>
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: exercise.data }]
        }}
        width={200}
        height={100}
        chartConfig={{
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      ref={scrollViewRef}
      onScroll={(event) => handleScroll(event, setTabBarVisible)}
      scrollEventThrottle={16}
    >
      <View style={styles.totalCard}>
        <Text style={styles.totalTitle}>Total: {totalBigThree} lbs</Text>
      </View>
      {exerciseProgress.map(renderExerciseCard)}
    </ScrollView>
  );
};

export default Progress