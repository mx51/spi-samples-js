import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IPreAuthState, IPreAuthValues } from './interfaces';

export const preAuths = (state: RootState): IPreAuthState => state.preAuth;

export const selectAllPreAuths = createSelector(preAuths, (state): IPreAuthValues[] => state.openPreAuths);

export const selectPreAuthKeyPadAmount = createSelector(preAuths, (state): number => state.keyPadAmount);

export const selectPreAuthById = createSelector(
  [preAuths, (state: RootState, id: string) => id],
  (state, id): IPreAuthValues | undefined => state.openPreAuths.find((preAuthItem) => preAuthItem?.preAuthRef === id)
);
