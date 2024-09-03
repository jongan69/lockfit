import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useTheme } from '../../contexts/ThemeContext'
import { createThemedStyles, getCalendarTheme } from '../../styles/theme'
import { useUserStore } from '../../stores/UserStore'
import { CompletedWorkout } from '@/types/workout'

const History = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false }
  const styles = createThemedStyles(isDarkMode)
  const calendarTheme = getCalendarTheme(isDarkMode)
  const { workoutHistory } = useUserStore()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  const markedDates = Object.keys(workoutHistory).reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, date) => {
    acc[date] = { marked: true, dotColor: '#FF6B6B' }
    return acc
  }, {})

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      marked: true,
      dotColor: isDarkMode ? '#3498db' : '#2980b9',
    }
  }

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString)
  }

  const jumpToToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setCurrentDate(today)
    setSelectedDate(today)
  }

  type WorkoutExercise = CompletedWorkout['exercises'][number]

  const renderExerciseDetails = (exercises: WorkoutExercise[]) => {
    if (!exercises || exercises.length === 0) {
      return <Text style={{ ...styles.text, fontStyle: 'italic' }}>No exercises recorded for this workout.</Text>
    }

    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {exercise.sets && exercise.sets.map((set, setIndex) => (
          <Text key={setIndex} style={styles.setDetails}>
            Set {setIndex + 1}: {set.weight}, {set.reps} reps
          </Text>
        ))}
      </View>
    ))
  }

  const renderWorkouts = (date: string) => {
    const workoutForDate = workoutHistory[date]
    if (!workoutForDate || !workoutForDate.workout) {
      return <Text style={styles.workoutText}>No workouts found for this date.</Text>
    }

    const workout = workoutForDate.workout
    return (
      <View style={styles.workoutCard}>
        <Text style={styles.workoutText}>Workout: {workout.name || 'Unknown'}</Text>
        {renderExerciseDetails(workout.exercises || [])}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.todayButton} onPress={jumpToToday}>
          <Text style={styles.todayButtonText}>Jump to Today</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        current={currentDate}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={calendarTheme}
      />
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.workoutDate}>{selectedDate}</Text>
          {renderWorkouts(selectedDate)}
        </View>
      )}
    </ScrollView>
  )
}

export default History