import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPreAuthValues, IPreAuthAction, IPreAuthState } from './interfaces';

export const initialState: IPreAuthState = {
  openPreAuths: [] as IPreAuthValues[],
  keyPadAmount: 0,
};

export const preAuthSlice = createSlice({
  name: 'preAuthSlice',
  initialState,
  reducers: {
    resetPreAuth: () => initialState,
    addPreAuth: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      state.openPreAuths.push(preAuth);
    },
    updateKeypadAmount: (state, action: PayloadAction<number>) => {
      state.keyPadAmount = action.payload;
    },
    clearKeypadAmount: (state) => {
      state.keyPadAmount = 0;
    },
    updatePreAuth: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      const index = state.openPreAuths.findIndex((obj) => obj.preAuthRef === preAuth.preAuthRef);
      if (index !== -1) {
        state.openPreAuths[index] = preAuth;
      }
    },
    updatePreAuthSurcharge: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      const index = state.openPreAuths.findIndex((obj) => obj.preAuthRef === preAuth.preAuthRef);
      if (index !== -1) {
        state.openPreAuths[index].surcharge = preAuth.surcharge;
      }
    },
    topupPreAuth: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      const index = state.openPreAuths.findIndex((obj) => obj.preAuthRef === preAuth.preAuthRef);
      if (index !== -1) {
        state.openPreAuths[index].preAuthAmount += preAuth.topupAmount;
      }
    },
    reducePreAuth: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      const index = state.openPreAuths.findIndex((obj) => obj.preAuthRef === preAuth.preAuthRef);
      if (index !== -1) {
        state.openPreAuths[index].preAuthAmount -= preAuth.reduceAmount;
      }
    },
    clearPreAuth: (state, action: PayloadAction<IPreAuthAction>) => {
      const { preAuth } = action.payload;
      const index = state.openPreAuths.findIndex((obj) => obj.preAuthRef === preAuth.preAuthRef);
      if (index !== -1) {
        state.openPreAuths.splice(index, 1);
      }
    },
  },
});

export const {
  resetPreAuth,
  addPreAuth,
  updateKeypadAmount,
  updatePreAuth,
  updatePreAuthSurcharge,
  clearKeypadAmount,
  topupPreAuth,
  reducePreAuth,
  clearPreAuth,
} = preAuthSlice.actions;

export default preAuthSlice.reducer;
