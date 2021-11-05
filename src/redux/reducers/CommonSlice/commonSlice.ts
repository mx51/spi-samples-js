import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICommonState } from './interfaces';

const initialState: ICommonState = {
  showFlowPanel: false,
  acquireConfirmPairingFlow: false,
};

export const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    setConfirmPairingFlow(state, action: PayloadAction<boolean>) {
      state.acquireConfirmPairingFlow = action.payload;
    },
    toggleFlowPanel(state, action: PayloadAction<boolean>) {
      state.showFlowPanel = action.payload;
    },
  },
});

export const { setConfirmPairingFlow, toggleFlowPanel } = commonSlice.actions;

export default commonSlice.reducer;
