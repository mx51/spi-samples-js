import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPreAuthAction, IPreAuthValues } from './interfaces';

export const initialState: IPreAuthValues = {
  preAuthRef: '',
  amount: 0,
  surcharge: 0,
  verified: false,
};

export const preAuthSlice = createSlice({
  name: 'preAuthSlice',
  initialState,
  reducers: {
    resetPreAuth: () => initialState,
    updatePreAuthParams(state: IPreAuthValues, action: PayloadAction<IPreAuthAction>) {
      const { key, value } = action.payload;

      switch (key) {
        case 'UPDATE_PRE_AUTH_REF':
          return {
            ...state,
            preAuthRef: value,
          };
        case 'UPDATE_AMOUNT':
          return {
            ...state,
            amount: value,
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
          const currentAmount = state.amount;
          const newAmount = currentAmount + value;
          return {
            ...state,
            amount: newAmount,
          };
        }
        case 'REDUCE_PRE_AUTH': {
          const currentAmount = state.amount;
          const newAmount = currentAmount - value;
          return {
            ...state,
            amount: newAmount,
          };
        }
        case 'CANCEL_PRE_AUTH':
          return initialState;
        case 'COMPLETE_PRE_AUTH':
          return initialState;
        default:
          return state;
      }
    },
  },
});

export const { resetPreAuth, updatePreAuthParams } = preAuthSlice.actions;

export default preAuthSlice.reducer;
