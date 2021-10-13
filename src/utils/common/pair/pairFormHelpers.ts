import React, { Dispatch, SetStateAction } from 'react';
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
  TEXT_FORM_DEFAULT_OPTION,
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
    option: TEXT_FORM_DEFAULT_OPTION,
    value: '',
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

export const handleProviderOptionChange =
  (setSpi: React.Dispatch<React.SetStateAction<ISPIFormData>>, attribute: string) =>
  (event: IFormEventValue): void => {
    setFormState(setSpi, attribute, { option: event.target.value as unknown as string });

    if (event.target.value === TEXT_FORM_DEFAULT_VALUE || event.target.value === TEXT_FORM_DEFAULT_OPTION) {
      setFormState(setSpi, attribute, { value: '' });
    } else {
      setFormState(setSpi, attribute, { value: event.target.value as unknown as string });
    }
  };

export const handleProviderOnChange = changeEventWithValidatorHandler();

export const handleProviderBlur = blurEventHandler();

export const handleDeviceAddressTypeOnChange =
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

export const handleDeviceAddressOnChange = changeEventWithValidatorHandler();

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

export const handlePaymentProviderOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string) => boolean,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  if (event.target.value !== TEXT_FORM_DEFAULT_OPTION && event.target.value !== TEXT_FORM_DEFAULT_VALUE) {
    dispatch(
      updatePairFormParams({
        key: 'acquirerCode',
        value: {
          value: event.target.value as string,
          isValid: fieldRequiredValidator(event.target.value as string),
        },
      })
    );
  } else {
    dispatch(
      updatePairFormParams({
        key: 'acquirerCode',
        value: {
          value: '',
          isValid: false,
        },
      })
    );
  }

  handleProviderOptionChange(setSpi, 'provider')(event);
};

export const handlePaymentProviderOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string) => boolean,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'acquirerCode',
      value: {
        value: event.target.value as string,
        isValid: fieldRequiredValidator(event.target.value as string),
      },
    })
  );

  handleProviderBlur(setSpi, 'provider', fieldRequiredValidator)(event);
};

export const handleDeviceAddressTypeOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'addressType',
      value: event.target.value as string,
    })
  );

  handleConfigTypeBlur(setSpi, 'testMode')(event);
};

export const handleDeviceAddressOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  eftposAddressValidator: (type: string, value: string) => boolean,
  spi: ISPIFormData,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'deviceAddress',
      value: {
        value: event.target.value as string,
        isValid: eftposAddressValidator(spi.configuration.type, event.target.value as string),
      },
    })
  );
};

export const handleSerialNumberOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  serialNumberValidator: (value: string) => boolean,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'serialNumber',
      value: {
        value: event.target.value as string,
        isValid: serialNumberValidator(event.target.value as string),
      },
    })
  );

  handleSerialNumberBlur(setSpi, 'serialNumber', serialNumberValidator)(event);
};

export const handlerPosIdOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string) => boolean,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'posId',
      value: {
        value: event.target.value as string,
        isValid: fieldRequiredValidator(event.target.value as string),
      },
    })
  );

  handlePosIdBlur(setSpi, 'posId', fieldRequiredValidator)(event);
};

export const handleTestModeOnChange = (
  dispatch: Any,
  event: IFormEventCheckbox,
  setSpi: Dispatch<SetStateAction<ISPIFormData>>,
  updatePairFormParams: Any
): void => {
  dispatch(
    updatePairFormParams({
      key: 'testMode',
      value: event.target.checked,
    })
  );

  handleTestModeChange(setSpi, 'testMode')(event);
};
