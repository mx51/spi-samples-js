/* eslint-disable no-useless-escape */
import { SPI_PAIR_STATUS, TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE } from '../../definitions/constants/commonConfigs';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';

export const eftposIPAddressRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\:[0-9]{1,5})?$/;
export const eftposAutoAddressRegex = /^[a-zA-Z0-9\.-]+$/;
export const numberCharactersRegex = /^[a-zA-Z0-9]+$/;
export const serialNumberRegex = /^[0-9.-]*$/;

function eftposAddressValidator(addressType: string, value: string): boolean {
  const eftposRegex =
    addressType !== TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE ? eftposIPAddressRegex : eftposAutoAddressRegex;

  return !!value.match(eftposRegex);
}

function eftposIPAddressValidator(value: string): boolean {
  return !!value.match(eftposIPAddressRegex);
}

function fieldRequiredValidator(value: string): boolean {
  return value.length > 0;
}

function numberCharactersValidator(value: string): boolean {
  return !!value.match(numberCharactersRegex);
}

function paymentProviderValidator(value: string): boolean {
  return fieldRequiredValidator(value) && numberCharactersValidator(value);
}

function serialNumberValidatorOnBlur(value: string): string {
  const valueWithoutDash = value.replaceAll('-', '');
  if (valueWithoutDash.length < 9) return 'Please enter a 9 digits Serial number.';
  return '';
}
function serialNumberValidatorOnChange(value: string): string {
  if (!value.match(serialNumberRegex)) return 'Sorry, the serial number should only contain numbers. Please try again.';
  return '';
}

function postIdValidator(value: string, terminals: ITerminalState): string {
  if (value === '') return 'POS Id is required';
  if (!value.match(numberCharactersRegex)) return 'POS Id must contain only alphanumeric characters';
  if (value.length > 16) return 'POS Id must be less than 16 characters long';
  if (Object.values(terminals).filter((t) => t.posId === value && t.status !== SPI_PAIR_STATUS.Unpaired).length > 0)
    return 'POS ID must be unique, please choose another';
  return '';
}

export {
  eftposAddressValidator,
  eftposIPAddressValidator,
  numberCharactersValidator,
  paymentProviderValidator,
  serialNumberValidatorOnBlur,
  serialNumberValidatorOnChange,
  fieldRequiredValidator,
  postIdValidator,
};
