import { createSlice } from '@reduxjs/toolkit';

const currentEnvSlice = createSlice({
  name: 'currentEnv',
  initialState: {
    env: 'LIVE', // Hide DEV settings by default
  },
  reducers: {
    setCurrentEnv: (state, action) => {
      state.env = action.payload;
    },
  },
});

export const { setCurrentEnv } = currentEnvSlice.actions;

export default currentEnvSlice.reducer;
