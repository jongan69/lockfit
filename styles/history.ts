import { StyleSheet } from 'react-native';

export const historyStyles = StyleSheet.create({
    workoutCard: {
      backgroundColor: '#FF6B6B',
      borderRadius: 10,
      padding: 15,
      margin: 15,
    },
    workoutDate: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 10,
    },
    workoutText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    buttonContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    todayButton: {
      backgroundColor: '#FF6B6B',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    todayButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });