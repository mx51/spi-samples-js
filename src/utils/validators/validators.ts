/* eslint-disable no-useless-escape */
import { SPI_PAIR_STATUS, TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE } from '../../definitions/constants/commonConfigs';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';

export const eftposIPAddressRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\:[0-9]{1,5})?$/;
export const eftposAutoAddressRegex = /^[a-zA-Z0-9\.-]+$/;
export const numberCharactersRegex = /^[a-zA-Z0-9]+$/;
export const serialNumberRegex = /^[^\s]{0,20}$/;
export const charactersRegex = /^[a-zA-Z]+$/;

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
function charactersValidator(value: string): boolean {
  return !!value.match(charactersRegex);
}

function paymentProviderValidator(value: string): boolean {
  return charactersValidator(value) && value.length <= 10;
}

function serialNumberValidatorOnBlur(value: string): string {
  if (!value.match(serialNumberRegex)) return 'Serial number must be 20 characters or less with no spaces.';
  return '';
}
function serialNumberValidatorOnChange(value: string): string {
  if (!value.match(serialNumberRegex)) return 'Serial number must be 20 characters or less with no spaces.';
  return '';
}

function isSerialNumberValid(value: string): boolean {
  return Boolean(value.match(serialNumberRegex));
}

function postIdValidator(value: string, terminals: ITerminalState): string {
  if (value === '') return 'POS Id is required';
  if (!value.match(numberCharactersRegex)) return 'POS Id must contain only alphanumeric characters';
  if (value.length > 16) return 'POS Id must be less than 16 characters long';
  if (Object.values(terminals).filter((t) => t.posId === value && t.status !== SPI_PAIR_STATUS.Unpaired).length > 0)
    return 'POS Id must be unique, please choose another';
  return '';
}

export {
  eftposAddressValidator,
  eftposIPAddressValidator,
  numberCharactersValidator,
  paymentProviderValidator,
  isSerialNumberValid,
  serialNumberValidatorOnBlur,
  serialNumberValidatorOnChange,
  fieldRequiredValidator,
  postIdValidator,
  charactersValidator,
};
