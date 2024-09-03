import { useCallback } from 'react';
import { CustomProgram, Program } from '@/types/program';
import { useUserStore } from '@/stores/UserStore';

export const usePrograms = () => {
  const { customPrograms, selectedProgram, setCustomPrograms, setSelectedProgram } = useUserStore();

  const saveCustomPrograms = useCallback((programs: CustomProgram[]) => {
    setCustomPrograms(programs);
  }, [setCustomPrograms]);

  return {
    customPrograms,
    selectedProgram,
    setSelectedProgram,
    saveCustomPrograms,
  };
};