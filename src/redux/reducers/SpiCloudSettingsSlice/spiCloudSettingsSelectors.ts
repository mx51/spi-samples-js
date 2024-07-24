import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ISpiCloudSettingsProps } from './interfaces';

export const spiCloudSettingsForm = (state: RootState): ISpiCloudSettingsProps => state.spiCloudSettings;

export const selectSpiCloudSettingsDev = createSelector(spiCloudSettingsForm, (params) => params.dev);
