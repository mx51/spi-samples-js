import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IPreAuthValues } from './interfaces';

export const preAuth = (state: RootState): IPreAuthValues => state.preAuth;

export const preAuthSelector = createSelector(preAuth, (params) => ({
  preAuthRef: params.preAuthRef,
  amount: params.amount,
  surcharge: params.surcharge,
  verified: params.verified,
}));

export const isPreAuthDisabledSelector = createSelector(preAuth, (params) => !params.preAuthRef || !params.amount);
