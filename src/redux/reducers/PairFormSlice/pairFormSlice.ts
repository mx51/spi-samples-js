import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  deviceAddressEnv,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_OPTION,
} from '../../../definitions/constants/commonConfigs';
import { isHttps } from '../../../utils/common/pair/pairFormHelpers';
import { IFormParamsAction, IPairFormParams, ITerminalPairError } from './interfaces';

const initialState: IPairFormParams = {
  acquirerCode: {
    value: '',
    option: TEXT_FORM_DEFAULT_OPTION,
    isValid: true,
  },
  addressType: isHttps() ? TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE : TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  deviceAddress: {
    value: '',
    isValid: true,
  },
  error: {
    isShown: false,
    message: '',
  },
  posId: {
    value: '',
    isValid: true,
  },
  serialNumber: {
    value: '',
    isValid: true,
  },
  testMode: true,
  environment: undefined,
};

// The only reason for introducing pairFormSlice is for checking pair Form validation because before pairing process terminal instance id (serial number) is not available
export const pairFormSlice = createSlice({
  name: 'pairFormSlice',
  initialState,
  reducers: {
    readTerminalPairError(state: IPairFormParams, action: PayloadAction<ITerminalPairError>) {
      const error = {
        ...action.payload,
        message:
          'Sorry, we were unable to pair with the EFTPOS terminal. Please check the Serial Number and Payment Provider have been entered correctly and try again',
      };
      state.error = error;
    },
    resetPairForm: () => initialState,
    updatePairFormParams(state: IPairFormParams, action: PayloadAction<Partial<IFormParamsAction>>) {
      const { key, value } = action.payload;

      switch (key) {
        case 'acquirerCode':
          return {
            ...state,
            acquirerCode: value,
            environment: value.value === 'perf' ? deviceAddressEnv.rnd : undefined,
            testMode: ['perf', 'eng'].includes(value.value) ? false : state.testMode,
          };
        case 'addressType':
          return {
            ...state,
            addressType: value,
          };
        case 'deviceAddress':
          return {
            ...state,
            deviceAddress: value,
          };
        case 'posId':
          return {
            ...state,
            posId: value,
          };
        case 'serialNumber':
          return {
            ...state,
            serialNumber: value,
          };
        case 'testMode':
          return {
            ...state,
            testMode: value,
          };
        case 'environment': {
          return {
            ...state,
            environment: value,
          };
        }
        default:
          return state;
      }
    },
  },
});

export const { readTerminalPairError, resetPairForm, updatePairFormParams } = pairFormSlice.actions;

export default pairFormSlice.reducer;
