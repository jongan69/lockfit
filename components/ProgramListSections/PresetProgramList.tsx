import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Program } from '@/types/program';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/styles/theme';

interface PresetProgramListProps {
  programs: Program[];
  selectedProgram: Program | null;
  onSelectProgram: (program: Program) => void;
}

const PresetProgramList: React.FC<PresetProgramListProps> = ({ programs, selectedProgram, onSelectProgram }) => {
    const theme = useTheme();
    const isDarkMode = theme?.isDarkMode;
    const styles = createThemedStyles(isDarkMode ?? false);

  return (
    <View>
      <Text style={styles.sectionTitle}>Preset 5x5 Programs</Text>
      {programs.map(program => (
        <TouchableOpacity
          key={program.id}
          style={[
            styles.program,
            { backgroundColor: program.color },
            selectedProgram?.id === program.id && styles.selectedProgram
          ]}
          onPress={() => onSelectProgram(program)}
        >
          <Text style={styles.programText}>{program.name}</Text>
          <Text style={styles.exerciseText}>
            {program.workouts.map(workout => workout.exercises.map(exercise => exercise?.name).join(', ')).join(' | ')}
          </Text>
          {selectedProgram?.id === program.id && <Text style={styles.checkMark}>✔</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PresetProgramList;