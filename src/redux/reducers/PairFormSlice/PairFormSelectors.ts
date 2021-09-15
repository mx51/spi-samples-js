import { createSelector } from '@reduxjs/toolkit';
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
} from '../../../definitions/constants/commonConfigs';
import { RootState } from '../../store';
import { IPairFormParams } from './interfaces';

export const pairForm = (state: RootState): IPairFormParams => state.pairForm;

export const selectPairFormValues = createSelector(pairForm, (params) => ({
  acquirerCode: params.acquirerCode.value,
  autoAddress: params.addressType === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  deviceAddress: params.deviceAddress.value,
  posId: params.posId.value,
  serialNumber: params.serialNumber.value,
  testMode: params.testMode,
  secrets: null,
}));

export const isPairButtonDisabled = createSelector(
  pairForm,
  (params) =>
    (params.addressType === TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE && params.deviceAddress.value === '') ||
    !params.acquirerCode.isValid ||
    !params.posId.isValid ||
    !params.serialNumber.isValid ||
    (params.addressType !== TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE && !params.deviceAddress.isValid)
);

export const selectPairFormDeviceAddress = createSelector(pairForm, (params) => params.deviceAddress.value);

export const selectPairFormSerialNumber = createSelector(pairForm, (params) => params.serialNumber.value);
