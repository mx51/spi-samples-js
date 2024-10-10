import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SpiCloudPairingState } from './interfaces';

export const pairingsMap = (state: RootState): SpiCloudPairingState => {
  const { _persist, ...pairings } = state.pairings;
  return pairings;
};

export const pairingsList = createSelector(pairingsMap, (pMap) => Object.values(pMap));
