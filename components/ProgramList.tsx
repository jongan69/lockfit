import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, SafeAreaView, Text, Alert } from 'react-native';
import { CustomProgram, Program } from '@/types/program';
import { usePrograms } from '@/hooks/usePrograms';
import PresetProgramList from './ProgramListSections/PresetProgramList';
import CustomProgramList from './ProgramListSections/CustomProgramList';
import { presetPrograms } from '@/utils/presetPrograms';
import { handleCreateCustomProgram } from '@/utils/handleCreateCustomProgram';
import { handleEditCustomProgram } from '@/utils/editCustomProgram';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/styles/theme';

const ProgramList = ({ onSelectProgram }: { onSelectProgram: (program: Program | CustomProgram) => void }) => {
  const { isDarkMode } = useTheme() || {};
  const styles = createThemedStyles(isDarkMode ?? false);

  const {
    customPrograms,
    selectedProgram,
    setSelectedProgram,
    saveCustomPrograms,
  } = usePrograms();

  const handleProgramSelect = useCallback((program: Program | CustomProgram) => {
    setSelectedProgram(program);
    onSelectProgram(program);
  }, [setSelectedProgram, onSelectProgram]);

  const handleDeleteProgram = useCallback((program: CustomProgram) => {
    Alert.alert(
      'Delete Program',
      `Are you sure you want to delete "${program.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedPrograms = customPrograms.filter(p => p.id !== program.id);
            saveCustomPrograms(updatedPrograms);
            if (selectedProgram?.id === program.id) {
              setSelectedProgram(null);
            }
          },
          style: 'destructive'
        }
      ]
    );
  }, [customPrograms, saveCustomPrograms, selectedProgram, setSelectedProgram]);

  const handleLongPress = useCallback((program: CustomProgram) => {
    Alert.alert(
      'Program Options',
      'What would you like to do?',
      [
        {
          text: 'Edit',
          onPress: () => handleEditCustomProgram(program, customPrograms, saveCustomPrograms)
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteProgram(program),
          style: 'destructive'
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }, [customPrograms, saveCustomPrograms, handleDeleteProgram]);

  const handleCreateProgram = useCallback(() => {
    handleCreateCustomProgram(
      customPrograms,
      saveCustomPrograms,
      handleProgramSelect
    );
  }, [customPrograms, saveCustomPrograms, handleProgramSelect]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.programListContainer}>
        <PresetProgramList
          programs={presetPrograms}
          selectedProgram={selectedProgram}
          onSelectProgram={handleProgramSelect}
        />
        <CustomProgramList
          programs={customPrograms}
          selectedProgram={selectedProgram as CustomProgram | null}
          onSelectProgram={handleProgramSelect}
          onLongPress={handleLongPress}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateProgram}
        >
          <Text style={styles.createButtonText}>Create Custom Program</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgramList;