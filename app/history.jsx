import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useTheme } from '../context/ThemeContext'
import { createThemedStyles } from '../styles/theme'
import { historyStyles } from '../styles/history'

const History = () => {
  const { isDarkMode } = useTheme();
  const styles = createThemedStyles(isDarkMode);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for workout history
  const workoutHistory = {
    '2024-05-01': { workout: 'Strength Training' },
    '2023-05-03': { workout: 'Cardio' },
    '2023-05-05': { workout: 'Flexibility' },
  };

  const markedDates = Object.keys(workoutHistory).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#FF6B6B' };
    return acc;
  }, {});

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const jumpToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={historyStyles.buttonContainer}>
        <TouchableOpacity style={historyStyles.todayButton} onPress={jumpToToday}>
          <Text style={historyStyles.todayButtonText}>Jump to Today</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        current={currentDate}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          calendarBackground: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          textSectionTitleColor: isDarkMode ? '#FFFFFF' : '#000000',
          dayTextColor: isDarkMode ? '#FFFFFF' : '#000000',
          todayTextColor: '#FF6B6B',
          selectedDayBackgroundColor: '#FF6B6B',
          monthTextColor: isDarkMode ? '#FFFFFF' : '#000000',
        }}
      />
      {selectedDate && (
        <View style={historyStyles.workoutCard}>
          <Text style={historyStyles.workoutDate}>{selectedDate}</Text>
          {workoutHistory[selectedDate] ? (
            <Text style={historyStyles.workoutText}>
              Workout: {workoutHistory[selectedDate].workout}
            </Text>
          ) : (
            <Text style={historyStyles.workoutText}>
              No workout found for this date.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  )
}

export default History