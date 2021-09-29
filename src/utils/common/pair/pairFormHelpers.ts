import React from 'react';
import {
  IFormEventCheckbox,
  IFormEventValue,
  ISPIAttribute,
  ISPIFormData,
} from '../../../components/PairPage/PairForm/interfaces';
import {
  SPI_PAIR_STATUS,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
  TEXT_FORM_MODAL_CODE_TILL,
  TEXT_FORM_MODAL_CODE_WESTPAC,
} from '../../../definitions/constants/commonConfigs';

export function disableProviderField(status: string, spiProviderValue: string): boolean {
  return (
    status === SPI_PAIR_STATUS.PairedConnecting ||
    spiProviderValue === TEXT_FORM_MODAL_CODE_TILL ||
    spiProviderValue === TEXT_FORM_MODAL_CODE_WESTPAC ||
    spiProviderValue === TEXT_FORM_DEFAULT_VALUE
  );
}

export function isHttps(): boolean {
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

export const initialSpiFormData = {
  provider: {
    isValid: true,
    modalToggle: false,
    value: TEXT_FORM_DEFAULT_VALUE,
  },
  configuration: {
    isValid: true,
    type: isHttps() ? TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE : TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
    value: '',
  },
  serialNumber: {
    isValid: true,
    value: '',
  },
  posId: {
    isValid: true,
    value: '',
  },
  testMode: !isHttps(),
};

// generic state setter (spi)
export const setFormState = (
  setState: React.Dispatch<React.SetStateAction<ISPIFormData>>,
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
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, { value: event.target.value as unknown as string });
  };

const blurEventHandler =
  () =>
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { isValid: fieldValidator(currentSerialNumber) });
  };

const changeEventWithValidatorHandler =
  () =>
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (value: string): void => {
    setFormState(setSpi, attribute, { value, isValid: fieldValidator(value) });
  };

export const handleProviderChange = changeEventWithValidatorHandler();

export const handleModalOpen = (
  setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>,
  attribute: string
): void => {
  setFormState(setSpi, attribute, { modalToggle: true });
};

export const handleModalClose =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (newValue: string): void => {
    setFormState(setSpi, attribute, { value: newValue, modalToggle: false, isValid: true });
  };

export const handleProviderBlur = blurEventHandler();

export const handleConfigTypeChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, { type: event.target.value as unknown as string });
  };

export const handleConfigTypeBlur =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(
      setSpi,
      attribute,
      (event.target.value as unknown as string) === TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE
    );
  };

export const handleConfigAddressChange = changeEventWithValidatorHandler();

export const handleSerialNumberChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { value: serialNumberFormatter(currentSerialNumber) });
  };

export const handleSerialNumberBlur =
  (
    setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>,
    attribute: string,
    fieldValidator: (value: string) => boolean
  ) =>
  (event: IFormEventValue): void => {
    const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);
    setFormState(setSpi, attribute, { isValid: fieldValidator(currentSerialNumber) });
  };

export const handlePosIdChange = changeEventHandler();

export const handlePosIdBlur = blurEventHandler();

export const handleTestModeChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventCheckbox): void => {
    setFormState(setSpi, attribute, event.target.checked as unknown as string);
  };
