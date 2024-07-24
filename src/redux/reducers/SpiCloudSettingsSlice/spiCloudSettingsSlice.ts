import { createSlice } from '@reduxjs/toolkit';
import { ISpiCloudSettingsProps } from './interfaces';

const spiCloudSettingsSlice = createSlice({
  name: 'spiCloudSettings',
  initialState: {
    dev: {
      apiBaseUrl: 'https://spi-cloud-pairing-api-dev.integration-nonprod.mspenv.io/api/v1/progress-pairing',
      apiKey: '',
      secretPartA: '',
    },
  },
  reducers: {
    resetSpiCloudSettingsSlice() {
      return {
        dev: {
          apiBaseUrl: 'https://spi-cloud-pairing-api-dev.integration-nonprod.mspenv.io/api/v1/progress-pairing',
          apiKey: '',
          secretPartA: '',
        },
      };
    },
    setDevSettings(state: ISpiCloudSettingsProps, action) {
      state.dev = {
        apiBaseUrl: 'https://spi-cloud-pairing-api-dev.integration-nonprod.mspenv.io/api/v1/progress-pairing',
        ...action.payload,
      };
    },
  },
});

export const { resetSpiCloudSettingsSlice, setDevSettings } = spiCloudSettingsSlice.actions;

export default spiCloudSettingsSlice.reducer;
