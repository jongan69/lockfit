import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles, getCalendarTheme } from '../../styles/theme'

interface WorkoutHistoryEntry {
  workout: string;
}

const History = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);
  const calendarTheme = getCalendarTheme(isDarkMode);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for workout history
  const workoutHistory: Record<string, WorkoutHistoryEntry> = {
    '2024-09-01': { workout: 'Strength Training' },
    '2023-05-03': { workout: 'Cardio' },
    '2023-05-05': { workout: 'Flexibility' },
  };

  const markedDates = Object.keys(workoutHistory).reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, date) => {
    acc[date] = { marked: true, dotColor: '#FF6B6B' };
    return acc;
  }, {});

  // Add selected date highlighting
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      marked: true,
      dotColor: isDarkMode ? '#3498db' : '#2980b9',
    };
  }

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const jumpToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setSelectedDate(today);
  };

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
        <View style={styles.workoutCard}>
          <Text style={styles.workoutDate}>{selectedDate}</Text>
          {workoutHistory[selectedDate] ? (
            <Text style={styles.workoutText}>
              Workout: {workoutHistory[selectedDate].workout}
            </Text>
          ) : (
            <Text style={styles.workoutText}>
              No workout found for this date.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  )
}

export default History