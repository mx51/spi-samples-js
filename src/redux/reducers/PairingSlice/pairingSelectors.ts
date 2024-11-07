import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SpiCloudPairing, SpiCloudPairingState } from './interfaces';

const developmentOnlyPairings = (state: RootState): SpiCloudPairingState => {
  const { _persist, ...pairings } = state.pairings;

  if (state.currentEnv?.env === 'DEV' || process.env.NODE_ENV === 'development') {
    return pairings;
  }

  return {};
};

export const pairingsMap = (state: RootState): SpiCloudPairingState => {
  const { _persist, ...pairings } = state.pairings;
  return pairings;
};

export const selectCloudPairings = (options?: { force?: boolean }): ((state: RootState) => SpiCloudPairing[]) => {
  // TODO: Remove this check to "release" to production - Always return cloud pairings and remove force override.
  if (options?.force) {
    return createSelector(pairingsMap, (pairings) => Object.values(pairings));
  }

  return createSelector(developmentOnlyPairings, (pairings) => Object.values(pairings));
};

export const selectHasCloudPairings = createSelector(selectCloudPairings(), (pairings) => pairings.length > 0);

export const selectCloudPairing = (id: string): ((state: RootState) => SpiCloudPairing) =>
  createSelector(pairingsMap, (pairings) => pairings[id]);
