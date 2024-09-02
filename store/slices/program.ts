import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Program {
  id: number;
  name: string;
  color: string;
  exercises: string[];
}

interface ProgramState {
  customPrograms: Program[];
}

const initialState: ProgramState = {
  customPrograms: [],
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setCustomPrograms(state, action: PayloadAction<Program[]>) {
      state.customPrograms = action.payload;
    },
  },
});

export const setCustomPrograms = (programs: Program[]) => ({
  type: 'program/setCustomPrograms',
  payload: programs,
});
export default programSlice.reducer;