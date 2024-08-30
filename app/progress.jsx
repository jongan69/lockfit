import React, { useState, useRef } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { createThemedStyles } from '../styles/theme'
import { LineChart } from 'react-native-chart-kit'
import { useTabBarVisibility } from '../context/TabBarVisibilityContext'

const Progress = () => {
  const { isDarkMode } = useTheme();
  const styles = createThemedStyles(isDarkMode);
  const { setTabBarVisible } = useTabBarVisibility();
  const scrollViewRef = useRef(null);

  // Mock data for PR weights and progress
  const exercises = [
    { name: 'Squat', pr: 225, data: [200, 210, 215, 220, 225] },
    { name: 'Bench Press', pr: 185, data: [165, 170, 175, 180, 185] },
    { name: 'Deadlift', pr: 315, data: [280, 290, 300, 310, 315] },
    { name: 'Overhead Press', pr: 135, data: [115, 120, 125, 130, 135] },
    { name: 'Barbell Row', pr: 165, data: [145, 150, 155, 160, 165] },
  ];

  const totalBigThree = exercises
    .filter(e => ['Squat', 'Bench Press', 'Deadlift'].includes(e.name))
    .reduce((sum, e) => sum + e.pr, 0);

  const renderExerciseCard = (exercise) => (
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

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;
    
    setTabBarVisible(!isCloseToBottom);
  };

  return (
    <ScrollView 
      style={styles.container}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.totalCard}>
        <Text style={styles.totalTitle}>Total: {totalBigThree} lbs</Text>
      </View>
      {exercises.map(renderExerciseCard)}
    </ScrollView>
  );
};

export default Progress