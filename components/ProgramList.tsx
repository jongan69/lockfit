import { Text, ScrollView, TouchableOpacity, StyleSheet, View, SafeAreaView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setCustomPrograms } from '../store/slices/program' // Adjust the import path as needed
import { setSelectedProgram } from '../store/slices/users' // Adjust the import path as needed

interface Program {
  id: number;
  name: string;
  color: string;
  exercises: string[];
}

const ProgramList = ({ onSelectProgram }: { onSelectProgram: (program: Program) => void }) => {
  const [customPrograms, setLocalCustomPrograms] = useState<Program[]>([])
  const selectedProgram = useSelector((state: RootState) => state.user.selectedProgram)
  const isImperial = useSelector((state: RootState) => state.user.isImperial)
  const dispatch = useDispatch()

  const presetPrograms: Program[] = [
    { 
      id: 1, 
      name: 'StrongLifts 5x5', 
      color: '#FF6B6B',
      exercises: ['Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Deadlift']
    },
    { 
      id: 2, 
      name: 'Starting Strength', 
      color: '#4ECDC4',
      exercises: ['Squat', 'Bench Press', 'Deadlift', 'Power Clean']
    },
    { 
      id: 3, 
      name: 'Madcow 5x5', 
      color: '#45B7D1',
      exercises: ['Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Deadlift']
    },
  ]

  useEffect(() => {
    if (selectedProgram) {
      const isPreset = presetPrograms.some(program => program.id === selectedProgram.id);
      if (!isPreset) {
        setLocalCustomPrograms(prevPrograms => [...prevPrograms, selectedProgram]);
      }
    }
  }, [selectedProgram]);

  const handleCreateCustomProgram = () => {
    const newProgram: Program = {
      id: Date.now(),
      name: 'Custom Program',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      exercises: []
    }
    setLocalCustomPrograms(prevPrograms => [...prevPrograms, newProgram])
  }

  const handleSelectProgram = (program: Program) => {
    Alert.prompt(
      'Customize Program',
      'Enter a new name for the program:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (newName?: string) => {
            if (newName !== undefined) {
              const customizedProgram = { ...program, id: Date.now(), name: newName || program.name };
              const updatedPrograms = [...customPrograms, customizedProgram];
              dispatch(setCustomPrograms(updatedPrograms));
              dispatch(setSelectedProgram(customizedProgram));
              onSelectProgram(customizedProgram);
            }
          },
        },
      ],
      'plain-text',
      program.name
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Preset 5x5 Programs</Text>
        {presetPrograms.map(program => (
          <TouchableOpacity
            key={program.id}
            style={[
              styles.program, 
              { backgroundColor: program.color },
              selectedProgram?.id === program.id && styles.selectedProgram
            ]}
            onPress={() => {
              dispatch(setSelectedProgram(program));
              onSelectProgram(program);
            }}
          >
            <Text style={styles.programText}>{program.name}</Text>
            <Text style={styles.exerciseText}>
              {program.exercises.join(', ')}
            </Text>
            {selectedProgram?.id === program.id && <Text style={styles.checkMark}>✔</Text>}
          </TouchableOpacity>
        ))}
        
        <Text style={styles.sectionTitle}>Custom Programs</Text>
        {customPrograms.map(program => (
          <TouchableOpacity
            key={program.id}
            style={[
              styles.program, 
              { backgroundColor: program.color },
              selectedProgram?.id === program.id && styles.selectedProgram
            ]}
            onPress={() => {
              dispatch(setSelectedProgram(program));
              onSelectProgram(program);
            }}
          >
            <Text style={styles.programText}>{program.name}</Text>
            <Text style={styles.exerciseText}>
              {program.exercises.length > 0 ? program.exercises.join(', ') : 'No exercises added'}
            </Text>
            {selectedProgram?.id === program.id && <Text style={styles.checkMark}>✔</Text>}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCustomProgram}
        >
          <Text style={styles.createButtonText}>Create Custom Program</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  program: {
    width: '100%',
    minHeight: 150,
    borderRadius: 25,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  selectedProgram: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 100, // Add extra padding at the bottom
  },
  programText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkMark: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    top: 10,
    right: 10,
  },
})

export default ProgramList;