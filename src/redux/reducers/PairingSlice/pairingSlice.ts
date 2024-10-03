import { createSlice } from '@reduxjs/toolkit';
import { IPairingState } from './interfaces';

const pairingSlice = createSlice({
  name: 'pairing',
  initialState: {},
  reducers: {
    resetPairingSlice() {
      return {};
    },
    addPairing(state: IPairingState, action) {
      const { posNickname, id, pairingConfig } = action.payload;
      state[id] = { posNickname, ...pairingConfig };
    },
    removePairing(state: IPairingState, action) {
      delete state[action.payload];
    },
  },
});

export const { resetPairingSlice, addPairing } = pairingSlice.actions;

export default pairingSlice.reducer;
