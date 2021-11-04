import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICommonState } from './interfaces';

const initialState: ICommonState = {
  showFlowPanel: false,
};

export const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    toggleFlowPanel(state, action: PayloadAction<boolean>) {
      state.showFlowPanel = action.payload;
    },
  },
});

export const { toggleFlowPanel } = commonSlice.actions;

export default commonSlice.reducer;
