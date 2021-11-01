import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  showFlowPanel: false,
};

export const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    toggleFlowPanel(state, action: PayloadAction<boolean>) {
      const showFlowPanel = action.payload;
      state.showFlowPanel = showFlowPanel;
    },
  },
});

export const { toggleFlowPanel } = commonSlice.actions;

export default commonSlice.reducer;
