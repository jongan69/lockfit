import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CustomProgram } from '@/types/program';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/styles/theme';

interface CustomProgramListProps {
  programs: CustomProgram[];
  selectedProgram: CustomProgram | null;
  onSelectProgram: (program: CustomProgram) => void;
  onLongPress: (program: CustomProgram) => void;
}

const CustomProgramList: React.FC<CustomProgramListProps> = ({
  programs,
  selectedProgram,
  onSelectProgram,
  onLongPress
}) => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);

  return (
    <View>
      <Text style={styles.sectionTitle}>Custom Programs</Text>
      {programs.map(program => (
        <TouchableOpacity
          key={program.id}
          style={[
            styles.program,
            { backgroundColor: program.color },
            selectedProgram?.id === program.id && styles.selectedProgram
          ]}
          onPress={() => onSelectProgram(program)}
          onLongPress={() => onLongPress(program)}
        >
          <Text style={styles.programText}>{program.name}</Text>
          <Text style={styles.exerciseText}>
            Schedule: {program.schedule}, Split: {program.split}
          </Text>
          <Text style={styles.exerciseText}>
            Workouts: {program.workouts.length}
          </Text>
          {selectedProgram?.id === program.id && <Text style={styles.checkMark}>✔</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomProgramList;