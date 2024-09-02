import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  notificationsEnabled: boolean;
  language: string;
}

const initialState: AppState = {
  notificationsEnabled: false,
  language: 'English',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { toggleNotifications, setLanguage } = appSlice.actions;
export default appSlice.reducer;
