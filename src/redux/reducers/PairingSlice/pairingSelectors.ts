import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SpiCloudPairing, SpiCloudPairingState } from './interfaces';

export const pairingsMap = (state: RootState): SpiCloudPairingState => {
  const { _persist, ...pairings } = state.pairings;
  return pairings;
};

export const selectCloudPairings = createSelector(pairingsMap, (pMap) => Object.values(pMap));

export const selectHasCloudPairings = createSelector(selectCloudPairings, (pairings) => pairings.length > 0);

export const selectCloudPairing = (id: string): ((state: RootState) => SpiCloudPairing) =>
  createSelector(pairingsMap, (pairings) => pairings[id]);
