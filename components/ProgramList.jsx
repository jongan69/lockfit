import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const ProgramList = ({ onSelectProgram }) => {
  const programs = [
    { id: 1, name: 'Strength Training', color: '#FF6B6B' },
    { id: 2, name: 'Cardio', color: '#4ECDC4' },
    { id: 3, name: 'Flexibility', color: '#45B7D1' },
  ]

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {programs.map(program => (
        <TouchableOpacity
          key={program.id}
          style={[styles.program, { backgroundColor: program.color }]}
          onPress={() => onSelectProgram(program)}
        >
          <Text style={styles.programText}>{program.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  program: {
    width: '100%',
    height: 150,
    borderRadius: 25,
    borderCurve: 'continuous',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '100%'
  },
  programText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  }
})

export default ProgramList;