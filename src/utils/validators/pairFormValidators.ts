import { ISPIData } from '../../components/PairPage/PairForm/interfaces';

function serialNumberValidator(value: string): boolean {
  const valueWithoutDash = value.replaceAll('-', '');

  return valueWithoutDash.length > 0 && valueWithoutDash.length === 9;
}

function fieldRequiredValidator(value: string): boolean {
  return value.length > 0;
}

function saveButtonValidator(spi: ISPIData): boolean {
  const {
    provider: { value: selectedProvider, isValid: providerValid },
    serialNumber: { value: serialNumberValue, isValid: serialNumberValid },
    posId: { value: posIdValue, isValid: posIdValid },
    apikey: { value: apikeyValue, isValid: apikeyValid },
  } = spi;

  return (
    providerValid &&
    serialNumberValid &&
    posIdValid &&
    apikeyValid &&
    selectedProvider !== '' &&
    serialNumberValue !== '' &&
    posIdValue !== '' &&
    apikeyValue !== ''
  );
}

export { serialNumberValidator, fieldRequiredValidator, saveButtonValidator };
