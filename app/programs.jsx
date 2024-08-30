import { View, useColorScheme } from 'react-native'
import React from 'react'
import ColorList from '../components/ColorList'
import { useTheme } from '../context/ThemeContext'
import { createThemedStyles } from '../styles/theme'
import ProgramList from '../components/ProgramList'

const Programs = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode);

  const handleSelectProgram = (program) => {
    // Handle program selection here
    console.log('Selected program:', program);
  };

  return (
    <View style={styles.container}>
      <ProgramList onSelectProgram={handleSelectProgram} />
    </View>
  )
}

export default Programs