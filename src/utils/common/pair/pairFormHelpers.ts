import { IFormEventCheckbox, IFormEventValue } from '../../../components/PairPage/PairForm/interfaces';
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_OPTION,
  TEXT_FORM_DEFAULT_VALUE,
} from '../../../definitions/constants/commonConfigs';

import { IUpdatePairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import { serialNumberValidatorOnBlur, serialNumberValidatorOnChange } from '../../validators/validators';
import { serialNumberFormatter } from '../helpers';

export function isHttps(): boolean {
  return window.location.protocol === 'https:';
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

// Payment Provider Selector
export const handlePaymentProviderSelectorOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string) => boolean,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  if (event.target.value !== TEXT_FORM_DEFAULT_OPTION && event.target.value !== TEXT_FORM_DEFAULT_VALUE) {
    dispatch(
      updatePairFormParams({
        key: 'acquirerCode',
        value: {
          value: event.target.value as string,
          option: event.target.value as string,
          isValid: fieldRequiredValidator(event.target.value as string),
        },
      }),
      dispatch(
        updatePairFormParams({
          key: 'testMode',
          value: event.target.value !== 'gko',
        })
      )
    );
  } else {
    dispatch(
      updatePairFormParams({
        key: 'acquirerCode',
        value: {
          value: '',
          option: event.target.value as string,
          isValid: false,
        },
      })
    );
  }
};

// Payment Provider Field
export const handlePaymentProviderFieldOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  paymentProviderValidator: (value: string) => boolean,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'acquirerCode',
      value: {
        value: event.target.value as string,
        option: TEXT_FORM_DEFAULT_VALUE,
        isValid: paymentProviderValidator(event.target.value as string),
      },
    })
  );
  dispatch(
    updatePairFormParams({
      key: 'testMode',
      value: event.target.value !== 'gko',
    })
  );
};

export const handlePaymentProviderFieldOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  paymentProviderValidator: (value: string) => boolean,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'acquirerCode',
      value: {
        value: event.target.value as string,
        option: TEXT_FORM_DEFAULT_VALUE,
        isValid: paymentProviderValidator(event.target.value as string),
      },
    })
  );
};

// Address Type Selector
export const handleAddressTypeSelectorOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'addressType',
      value: event.target.value as string,
    })
  );

  dispatch(
    updatePairFormParams({
      key: 'deviceAddress',
      value: {
        value: '',
        isValid: true,
      },
    })
  ); // reset the device address field value when address type change detected
};

export const handleAddressTypeSelectorOnBlur = (
  dispatch: Any,
  checkedValue: boolean,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'testMode',
      value: checkedValue,
    })
  );
};

// Device Address Field
export const handleDeviceAddressFieldOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'deviceAddress',
      value: {
        value: event.target.value as string,
        isValid: true,
      },
    })
  );
};

export const handleDeviceAddressFieldOnBlur = (
  addressType: string,
  dispatch: Any,
  event: IFormEventValue,
  eftposAddressValidator: (type: string, value: string) => boolean,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'deviceAddress',
      value: {
        value: event.target.value as string,
        isValid: eftposAddressValidator(addressType, event.target.value as string),
      },
    })
  );
};

// Serial Number Field
export const handleSerialNumberFieldOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  serialNumberValidator: (value: string) => string,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  const currentSerialNumber = (event.target.value as unknown as string).slice(0, 11);

  dispatch(
    updatePairFormParams({
      key: 'serialNumber',
      value: {
        value: serialNumberFormatter(currentSerialNumber),
        isValid: serialNumberValidatorOnChange(event.target.value as string) === '',
      },
    })
  );
};

export const handleSerialNumberFieldOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  serialNumberValidator: (value: string) => string,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'serialNumber',
      value: {
        value: event.target.value as string,
        isValid: serialNumberValidatorOnBlur(event.target.value as string) === '',
      },
    })
  );
};

// POS ID Field
export const handlePosIdFieldOnChange = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string, terminals: ITerminalState) => string,
  terminals: ITerminalState,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'posId',
      value: {
        value: event.target.value as string,
        isValid: fieldRequiredValidator(event.target.value as string, terminals) === '',
      },
    })
  );
};

export const handlePosIdFieldOnBlur = (
  dispatch: Any,
  event: IFormEventValue,
  fieldRequiredValidator: (value: string, terminals: ITerminalState) => string,
  terminals: ITerminalState,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'posId',
      value: {
        value: event.target.value as string,
        isValid: fieldRequiredValidator(event.target.value as string, terminals) === '',
      },
    })
  );
};

// Test Mode Checkbox
export const handleTestModeCheckboxOnChange = (
  dispatch: Any,
  event: IFormEventCheckbox,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'testMode',
      value: event.target.checked,
    })
  );
};

export const handleEnvironmentChanged = (
  dispatch: Any,
  event: IFormEventValue,
  updatePairFormParams: IUpdatePairFormParams
): void => {
  dispatch(
    updatePairFormParams({
      key: 'environment',
      value: event.target.value as string,
    })
  );
};
