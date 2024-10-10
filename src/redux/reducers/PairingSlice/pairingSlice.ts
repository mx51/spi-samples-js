import { createSlice } from '@reduxjs/toolkit';
import { SpiCloudPairing, SpiCloudPairingState } from './interfaces';

const testPairing: SpiCloudPairing = {
  posNickname: 'posNickname',
  hexCode: '#449DD1',
  tid: 'tid',
  tenant: 'tenant',
  environment: 'environment',
  pairingId: 'pairingId',
  signingSecretPartB: 'signingSecretPartB',
  spiCloudApiBaseUrl: 'spiCloud',
};

const testPairingSlice: SpiCloudPairingState = {
  testKey: testPairing,
};

const pairingSlice = createSlice({
  name: 'pairing',
  initialState: testPairingSlice,
  reducers: {
    resetPairingSlice() {
      return testPairingSlice;
    },
    addPairing(state: SpiCloudPairingState, action: { payload: SpiCloudPairing }) {
      state[action.payload.pairingId] = action.payload;
    },
    removePairing(state: SpiCloudPairingState, action: { payload: string }) {
      delete state[action.payload];
    },
  },
});

export const { resetPairingSlice, addPairing } = pairingSlice.actions;

export default pairingSlice.reducer;
