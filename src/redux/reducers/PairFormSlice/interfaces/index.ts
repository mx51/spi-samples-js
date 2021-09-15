export interface IPairFormParams {
  acquirerCode: {
    value: string;
    isValid: boolean;
  };
  addressType: string;
  deviceAddress: {
    value: string;
    isValid: boolean;
  };
  posId: {
    value: string;
    isValid: boolean;
  };
  serialNumber: {
    value: string;
    isValid: boolean;
  };
  testMode: boolean;
}

export interface IPairFormValues {
  acquirerCode: string;
  autoAddress: boolean;
  deviceAddress: string;
  posId: string;
  serialNumber: string;
  secrets: {
    encKey: string;
    hmacKey: string;
  } | null;
  testMode: boolean;
}

export interface IFormParamsAction {
  key: string;
  value: Any;
}
