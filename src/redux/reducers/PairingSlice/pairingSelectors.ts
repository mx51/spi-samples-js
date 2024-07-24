import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

import { IPairingState } from './interfaces';

export const pairingsMap = (state: RootState): IPairingState => {
  const { _persist, ...pairings } = state.pairings;
  return pairings;
};

export const pairingsList = createSelector(pairingsMap, (pMap) => Object.values(pMap));
