import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPreAuthAction, IPreAuthValues } from './interfaces';

export const initialState: IPreAuthValues = {
  preAuthRef: '',
  preAuthAmount: 0,
  currentAmount: 0,
  surcharge: 0,
  verified: false,
};

export const preAuthSlice = createSlice({
  name: 'preAuthSlice',
  initialState,
  reducers: {
    resetPreAuth: () => initialState,
    clearPreAuthAmount(state: IPreAuthValues) {
      state.preAuthAmount = 0;
    },
    clearPreAuthCurentAmount(state: IPreAuthValues) {
      state.currentAmount = 0;
    },
    updatePreAuthParams(state: IPreAuthValues, action: PayloadAction<IPreAuthAction>) {
      const { key, value } = action.payload;

      switch (key) {
        case 'UPDATE_PRE_AUTH_REF':
          return {
            ...state,
            preAuthRef: value,
          };
        case 'UPDATE_PRE_AUTH_AMOUNT':
          return {
            ...state,
            preAuthAmount: value,
          };
        case 'UPDATE_CURRENT_AMOUNT':
          return {
            ...state,
            currentAmount: value,
          };
        case 'UPDATE_SURCHARGE':
          return {
            ...state,
            surcharge: value,
          };
        case 'UPDATE_VERIFIED':
          return {
            ...state,
            verified: value,
          };
        case 'OPEN_PRE_AUTH':
          return {
            ...state,
            ...value,
          };
        case 'TOPUP_PRE_AUTH': {
          const newAmount = state.preAuthAmount + value;
          return {
            ...state,
            preAuthAmount: newAmount,
          };
        }
        case 'REDUCE_PRE_AUTH': {
          const newAmount = state.preAuthAmount - value;
          return {
            ...state,
            preAuthAmount: newAmount,
          };
        }
        case 'CANCEL_PRE_AUTH':
          return initialState;
        case 'COMPLETE_PRE_AUTH':
          return initialState;
        default:
          throw new Error(`Unhandled action key: ${key}`);
      }
    },
  },
});

export const { resetPreAuth, updatePreAuthParams, clearPreAuthAmount, clearPreAuthCurentAmount } = preAuthSlice.actions;

export default preAuthSlice.reducer;
