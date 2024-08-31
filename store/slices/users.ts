import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  publicKey: string | null;
}

const initialState: UserState = {
  publicKey: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    clearPublicKey: (state) => {
      state.publicKey = null;
    },
  },
});

export const { setPublicKey, clearPublicKey } = userSlice.actions;
export default userSlice.reducer;