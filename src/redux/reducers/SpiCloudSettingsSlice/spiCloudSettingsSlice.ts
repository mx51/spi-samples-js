import { createSlice } from '@reduxjs/toolkit';
import { ISpiCloudSettingsProps } from './interfaces';

const devUrl = 'https://spi-cloud-pairing-api-dev.integration-nonprod.mspenv.io/api/v1/progress-pairing';
const qaUrl = 'https://spi-cloud-pairing-api-qa.integration-nonprod.mspenv.io/api/v1/progress-pairing';
// TODO: This is not deployed yet
const liveUrl = '';

const spiCloudSettingsSlice = createSlice({
  name: 'spiCloudSettings',
  initialState: {
    dev: {
      apiBaseUrl: devUrl,
      apiKey: '',
      secretPartA: '',
    },
    qa: {
      apiBaseUrl: qaUrl,
      apiKey: '',
      secretPartA: '',
    },
    live: {
      apiBaseUrl: liveUrl,
      apiKey: '',
      secretPartA: '',
    },
    other: {
      apiBaseUrl: '',
      apiKey: '',
      secretPartA: '',
    },
  },
  reducers: {
    resetSpiCloudSettingsSlice() {
      return {
        dev: {
          apiBaseUrl: devUrl,
          apiKey: '',
          secretPartA: '',
        },
        qa: {
          apiBaseUrl: qaUrl,
          apiKey: '',
          secretPartA: '',
        },
        live: {
          apiBaseUrl: liveUrl,
          apiKey: '',
          secretPartA: '',
        },
        other: {
          apiBaseUrl: '',
          apiKey: '',
          secretPartA: '',
        },
      };
    },
    setPairingSettings(state: ISpiCloudSettingsProps, action: { payload: ISpiCloudSettingsProps }) {
      state.dev = {
        apiBaseUrl: devUrl,
        apiKey: action.payload.dev.apiKey,
        secretPartA: action.payload.dev.secretPartA,
      };
      state.qa = {
        apiBaseUrl: qaUrl,
        apiKey: action.payload.qa.apiKey,
        secretPartA: action.payload.qa.secretPartA,
      };
      state.live = {
        apiBaseUrl: liveUrl,
        apiKey: action.payload.live.apiKey,
        secretPartA: action.payload.live.secretPartA,
      };
      state.other = {
        apiBaseUrl: action.payload.other.apiBaseUrl,
        apiKey: action.payload.other.apiKey,
        secretPartA: action.payload.other.secretPartA,
      };
    },
  },
});

export const { resetSpiCloudSettingsSlice, setPairingSettings } = spiCloudSettingsSlice.actions;

export default spiCloudSettingsSlice.reducer;
