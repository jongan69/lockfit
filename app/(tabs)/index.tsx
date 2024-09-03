import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useScrollToTop } from '@react-navigation/native'
import WorkoutList from '../../components/WorkoutList'
import ExerciseCounter from '../../components/ExerciseCounter'
import WorkoutTimer from '../../components/WorkoutTimer'
import { useTheme } from '../../contexts/ThemeContext'
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext'
import { useUserStore } from '../../stores/UserStore'
import { createThemedStyles } from '../../styles/theme'
import { CompletedWorkout, Workout } from '../../types/workout'
import { handleEditCustomProgram } from '@/utils/editCustomProgram';

const Home = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false }
  const styles = createThemedStyles(isDarkMode)
  const navigation = useNavigation()
  const { setTabBarVisible } = useTabBarVisibility() ?? {}
  const { 
    recentActivity, 
    customPrograms, 
    saveCustomPrograms,
    lastCompletedWeights, 
    saveWorkoutHistory, 
    selectedProgram, 
    addRecentActivity 
  } = useUserStore();

  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)

  const scrollViewRef = React.useRef(null)
  useScrollToTop(scrollViewRef)

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (activeWorkout) return
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    const isAtTop = contentOffset.y <= 0
    setTabBarVisible?.(isAtTop || !isCloseToBottom)
  }, [activeWorkout, setTabBarVisible])

  useEffect(() => {
    setTabBarVisible?.(!activeWorkout)
  }, [activeWorkout, setTabBarVisible])

  const handleWorkoutStart = useCallback((workout: Workout) => {
    setActiveWorkout(workout)
    setTabBarVisible?.(false)
  }, [setTabBarVisible])

  const handleWorkoutComplete = useCallback((completedWorkout: CompletedWorkout) => {
    setActiveWorkout(null)
    navigation.setOptions({ tabBarStyle: undefined })
    const date = new Date().toISOString().split('T')[0]
    saveWorkoutHistory(date, {
      workout: {
        name: completedWorkout.name,
        exercises: completedWorkout.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets.map(set => ({
            weight: set.weight,
            reps: set.reps
          }))
        }))
      }
    })
    addRecentActivity(`Completed ${completedWorkout.name} on ${date}`)
  }, [navigation, saveWorkoutHistory, addRecentActivity])

  const handleEditWorkout = useCallback((workout: Workout) => {
    const program = customPrograms.find(p => p.workouts.some(w => w.id === workout.id));
    if (program) {
      handleEditCustomProgram(program, customPrograms, saveCustomPrograms);
    }
  }, [customPrograms, saveCustomPrograms]);

  const workoutsWithLastWeights = useMemo(() => 
    customPrograms.flatMap(program =>
      program.workouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          weight: lastCompletedWeights[exercise.name] || 0,
        })),
      }))
    ), [customPrograms, lastCompletedWeights]
  )

  const getCurrentDayWorkout = useCallback(() => {
    if (!selectedProgram) return null
    const today = new Date().getDay()
    return selectedProgram.workouts[today % selectedProgram.workouts.length]
  }, [selectedProgram])

  const currentWorkout = getCurrentDayWorkout()

  const renderProgramSection = () => (
    <View style={styles.programSection}>
      <Text style={styles.sectionTitle}>Current Program</Text>
      {selectedProgram ? (
        <>
          <Text style={styles.programName}>{selectedProgram.name}</Text>
          <Text style={styles.programDetails}>Schedule: {selectedProgram.schedule}</Text>
          <Text style={styles.programDetails}>Split: {selectedProgram.split}</Text>
        </>
      ) : (
        <Text style={styles.noProgram}>No program selected</Text>
      )}
    </View>
  )

  const renderTodaysWorkout = () => (
    currentWorkout && (
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>Today's Workout: {currentWorkout.name}</Text>
        {currentWorkout.exercises.map((exercise, index) => (
          <ExerciseCounter
            key={index}
            exercise={exercise}
            initialWeight={lastCompletedWeights[exercise.name] ?? exercise.weight ?? 100}
          />
        ))}
        <TouchableOpacity onPress={() => handleWorkoutStart(currentWorkout)}>
          <Text style={styles.startWorkoutButton}>Start Today's Workout</Text>
        </TouchableOpacity>
      </View>
    )
  )

  const renderRecentActivity = () => (
    <View style={styles.dashboardSection}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentActivity.map((activity, index) => (
        <Text key={index} style={styles.activityItem}>{activity}</Text>
      ))}
    </View>
  )

  const renderActiveWorkout = () => (
    activeWorkout && (
      <WorkoutTimer
        workout={activeWorkout}
        onComplete={() => {
          const completedWorkout: CompletedWorkout = {
            ...activeWorkout,
            date: new Date().toISOString(),
            duration: 0, // Replace with actual duration
            exercises: activeWorkout.exercises.map(exercise => ({
              name: exercise.name,
              sets: Array.isArray(exercise.sets) ? exercise.sets : []
            }))
          }
          handleWorkoutComplete(completedWorkout)
        }}
      />
    )
  )

  const renderWorkoutList = () => (
    !activeWorkout && customPrograms.length > 0 && (
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>Your Programs</Text>
        <WorkoutList 
          workouts={workoutsWithLastWeights}
          onWorkoutStart={handleWorkoutStart}
          onWorkoutComplete={handleWorkoutComplete}
          onEditWorkout={handleEditWorkout}
        />
      </View>
    )
  )

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {renderProgramSection()}
      {renderTodaysWorkout()}
      {renderActiveWorkout()}
      {renderWorkoutList()}
      {renderRecentActivity()}
    </ScrollView>
  )
}

export default Home