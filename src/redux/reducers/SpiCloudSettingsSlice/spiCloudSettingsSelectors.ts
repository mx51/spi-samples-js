import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ISpiCloudSettingsProps, SpiCloudEnvironment } from './interfaces';

const spiCloudSettingsForm = (state: RootState): ISpiCloudSettingsProps => state.spiCloudSettings;

export const selectSpiCloudSettingsHasValues = (env: SpiCloudEnvironment) =>
  createSelector(
    spiCloudSettingsForm,
    (params) => params[env].apiBaseUrl !== '' && params[env].apiKey !== '' && params[env].secretPartA !== ''
  );

export const selectSpiCloudSettings = createSelector(spiCloudSettingsForm, (params) => params);
