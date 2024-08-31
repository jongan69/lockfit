import { View, useColorScheme } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import ProgramList from '../../components/ProgramList'

const Programs = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);

  const handleSelectProgram = (program: any) => {
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