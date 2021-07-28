import React from 'react';
// constants
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
} from '../../definitions/constants/commonConfigs';
// interfaces
import { IFormEventValue, ISPIAttribute, ISPIData } from '../../components/PairPage/PairForm/interfaces';

function isHttps(): boolean {
  return window.location.protocol === 'https:';
}

function serialNumberFormatter(currentSerialNumber: string): string {
  let formatSerialNumber = currentSerialNumber.replaceAll('-', '');

  if (formatSerialNumber.length > 3 && formatSerialNumber.length <= 6)
    formatSerialNumber = `${formatSerialNumber.slice(0, 3)}-${formatSerialNumber.slice(3)}`;
  else if (currentSerialNumber.length > 6)
    formatSerialNumber = `${formatSerialNumber.slice(0, 3)}-${formatSerialNumber.slice(
      3,
      6
    )}-${formatSerialNumber.slice(6)}`;

  return formatSerialNumber;
}

export const initialSpi = {
  provider: {
    modalToggle: false,
    value: '',
    isValid: true,
  },
  configuration: {
    type: isHttps() ? TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE : TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
    value: '',
  },
  serialNumber: {
    value: '',
    isValid: true,
  },
  posId: {
    value: '',
    isValid: true,
  },
  apikey: {
    value: '',
    isValid: true,
  },
  testMode: isHttps(),
};

// generic state setter (spi)
export const setFormState = (
  setState: React.Dispatch<React.SetStateAction<ISPIData>>,
  attribute: string,
  newState: Record<string, unknown> | boolean | string
): void => {
  if (typeof newState === 'object') {
    return setState((prevState) => ({
      ...prevState,
      [attribute]: {
        ...(prevState as unknown as ISPIAttribute)[attribute],
        ...newState,
      },
    }));
  }

  return setState((prevState) => ({
    ...prevState,
    [attribute]: newState,
  }));
};

const changeEventHandler =
  () =>
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, { value: event.target.value as unknown as string });
  };

const blurEventHandler =
  () =>
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { isValid: fieldValidator(currentSerialNumber) });
  };

export const handleProviderChange =
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (value: string): void => {
    setFormState(setSpi, attribute, { value, isValid: fieldValidator(value) });
  };

export const handleModalOpen = (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string): void => {
  setFormState(setSpi, attribute, { modalToggle: true });
};

export const handleModalClose =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (newValue: string): void => {
    setFormState(setSpi, attribute, { value: newValue, modalToggle: false, isValid: true });
  };

export const handleProviderBlur = blurEventHandler();

export const handleConfigTypeChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, { type: event.target.value as unknown as string });
  };

export const handleConfigTypeBlur =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(
      setSpi,
      attribute,
      (event.target.value as unknown as string) === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE
    );
  };

export const handleConfigAddressChange = changeEventHandler();

export const handleSerialNumberChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { value: serialNumberFormatter(currentSerialNumber) });
  };

export const handleSerialNumberBlur =
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { isValid: fieldValidator(currentSerialNumber) });
  };

export const handlePosIdChange = changeEventHandler();

export const handlePosIdBlur = blurEventHandler();

export const handleApikeyChange = changeEventHandler();

export const handleApikeyBlur = blurEventHandler();

export const handleTestModeChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, event.target.value as unknown as string);
  };
