import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import WorkoutTimer from './WorkoutTimer';
import { useTabBarVisibility } from '../contexts/TabBarVisibilityContext';
import { CompletedWorkout, TimerWorkout, Workout, WorkoutListProps } from '../types/workout';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/stores/UserStore';
import { useSQLiteContext } from 'expo-sqlite';

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onWorkoutStart, onWorkoutComplete, onEditWorkout }) => {
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [timerVisible, setTimerVisible] = useState(false);
    const [workoutDuration, setWorkoutDuration] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const { setTabBarVisible } = useTabBarVisibility() || { setTabBarVisible: () => {} };
    const { isImperial } = useUserStore();  
    const db = useSQLiteContext();
    const units = isImperial ? 'lbs' : 'kg';

    const startWorkout = (workout: Workout) => {
        setSelectedWorkout(workout);
        setTimerVisible(true);
        setTabBarVisible(false);
        setWorkoutDuration(0);
        const interval = setInterval(() => {
            setWorkoutDuration(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);
        onWorkoutStart(workout);
    };

    const handleWorkoutComplete = () => {
        setTabBarVisible(true);
        setTimerVisible(false);
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        if (selectedWorkout) {
            const completedWorkout: CompletedWorkout = {
                name: selectedWorkout.name,
                exercises: selectedWorkout.exercises.map(exercise => ({
                    name: exercise.name,
                    sets: Array.isArray(exercise.sets) ? exercise.sets.map(set => ({ reps: set.reps, weight: set.weight })) : []
                })),
                date: new Date().toISOString().split('T')[0],
                duration: workoutDuration
            };
            saveCompletedWorkout(completedWorkout);
            onWorkoutComplete(completedWorkout);
        }
        setSelectedWorkout(null);
    };

    const saveCompletedWorkout = (workout: CompletedWorkout) => {
        db.withTransactionAsync(async () => {
            await db.runAsync(
                'INSERT INTO completed_workouts (name, exercises, date, duration) VALUES (?, ?, ?, ?)',
                [workout.name, JSON.stringify(workout.exercises), workout.date, workout.duration]
            );
        });
    };

    useEffect(() => {
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [timerInterval]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {workouts.map((workout, index) => (
                <View key={index} style={styles.workoutCard}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    {workout.exercises.map((exercise, exerciseIndex) => (
                        <View key={exerciseIndex}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.workoutDetails}>
                                Sets: {Array.isArray(exercise.sets) ? exercise.sets.length : 0} x Reps: {Array.isArray(exercise.sets) && exercise.sets.length > 0 ? exercise.sets[0].reps : 0}
                            </Text>
                            <Text style={styles.workoutWeight}>
                                Weight: {Array.isArray(exercise.sets) && exercise.sets.length > 0 ? exercise.sets[0].weight : 0} {units}
                            </Text>
                        </View>
                    ))}
                    {workout.exercises.length > 0 && (
                        <TouchableOpacity style={styles.startButton} onPress={() => startWorkout(workout)}>
                            <Text style={styles.startButtonText}>Start Workout</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => onEditWorkout(workout)} style={styles.editButton}>
                        <Ionicons name="pencil" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ))}

            {timerVisible && selectedWorkout && (
                <WorkoutTimer
                    workout={{
                        ...selectedWorkout,
                        exercises: selectedWorkout.exercises.map(exercise => ({
                            ...exercise,
                            duration: 0,
                            restDuration: 180, // 3 minutes rest
                        })),
                        reps: 0,
                        duration: workoutDuration,
                        restDuration: 180, // 3 minutes rest
                    } as TimerWorkout}
                    onComplete={handleWorkoutComplete}
                />
            )}
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
    startButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    startButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default WorkoutList;