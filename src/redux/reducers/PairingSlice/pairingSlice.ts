import { createSlice } from '@reduxjs/toolkit';
import { SpiCloudPairing, SpiCloudPairingState } from './interfaces';

const pairingSlice = createSlice({
  name: 'pairing',
  initialState: {},
  reducers: {
    resetPairingSlice() {
      return {};
    },
    addPairing(state: SpiCloudPairingState, action: { payload: SpiCloudPairing }) {
      state[action.payload.pairingId] = action.payload;
    },
    removePairing(state: SpiCloudPairingState, action: { payload: string }) {
      delete state[action.payload];
    },
  },
});

export const { resetPairingSlice, addPairing, removePairing } = pairingSlice.actions;

export default pairingSlice.reducer;
