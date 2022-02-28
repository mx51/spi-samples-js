/* eslint-disable no-useless-escape */
import { TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE } from '../../definitions/constants/commonConfigs';

export const eftposIPAddressRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\:[0-9]{1,5})?$/;
export const eftposAutoAddressRegex = /^[a-zA-Z0-9\.-]+$/;
export const numberCharactersRegex = /^[a-zA-Z0-9]+$/;

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

function serialNumberValidator(value: string): boolean {
  const valueWithoutDash = value.replaceAll('-', '');

  return valueWithoutDash.length > 0 && valueWithoutDash.length === 9;
}

function postIdValidator(value: string): boolean {
  return !!value.match(numberCharactersRegex) && value.length <= 16;
}

export {
  eftposAddressValidator,
  eftposIPAddressValidator,
  numberCharactersValidator,
  paymentProviderValidator,
  serialNumberValidator,
  fieldRequiredValidator,
  postIdValidator,
};
