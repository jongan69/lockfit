import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Program {
  id: number;
  name: string;
  color: string;
  exercises: string[];
}

interface ProgramState {
  customPrograms: Program[];
  setCustomPrograms: (programs: Program[]) => void;
}

export const useProgramStore = create(
  persist<ProgramState>(
    (set) => ({
      customPrograms: [],
      setCustomPrograms: (programs) => set({ customPrograms: programs }),
    }),
    {
      name: 'program-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);