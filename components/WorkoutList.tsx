import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import WorkoutTimer from './WorkoutTimer'
import { useTabBarVisibility } from '../context/TabBarVisibilityContext'

const WorkoutList = ({ workouts }: { workouts: any }) => {
    const [selectedWorkout, setSelectedWorkout] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [timerVisible, setTimerVisible] = useState(false)
    const { setTabBarVisible } = useTabBarVisibility() || { setTabBarVisible: () => {} };

    const handleWorkoutPress = (workout: any) => {
        setSelectedWorkout(workout)
        setModalVisible(true)
    }

    const startWorkout = () => {
        setTabBarVisible(false)
        setModalVisible(false)
        setTimerVisible(true)
    }

    const handleWorkoutComplete = () => {
        setTabBarVisible(true)
        setTimerVisible(false)
        setSelectedWorkout(null)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {workouts.map((workout: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; sets: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; reps: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; weight: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined }, index: React.Key | null | undefined) => (
                <TouchableOpacity key={index} style={styles.workoutCard} onPress={() => handleWorkoutPress(workout)}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutDetails}>Sets: {workout.sets} x Reps: {workout.reps}</Text>
                    <Text style={styles.workoutWeight}>Weight: {workout.weight} kg</Text>
                </TouchableOpacity>
            ))}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Start {selectedWorkout?.name ?? 'selected'} workout?</Text>
                        <TouchableOpacity style={styles.button} onPress={startWorkout}>
                            <Text style={styles.buttonText}>Start Workout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {timerVisible && selectedWorkout && (
                <WorkoutTimer
                    workout={selectedWorkout}
                    onComplete={handleWorkoutComplete}
                />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    workoutCard: {
        width: '100%',
        padding: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    workoutDetails: {
        fontSize: 16,
        marginBottom: 3,
    },
    workoutWeight: {
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
        marginTop: 15,
        minWidth: 100,
    },
    buttonClose: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
})

export default WorkoutList