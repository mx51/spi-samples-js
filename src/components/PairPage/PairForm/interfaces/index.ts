export interface ISPIModel {
  modalToggle: boolean;
  handleProviderChange: (value: string) => void;
  onClose: (newValue: string) => void;
  providerValue: string;
}

export interface IPreventDefault {
  preventDefault: () => void;
}

export interface ISPIFormData {
  provider: {
    modalToggle: boolean;
    value: string;
    isValid: boolean;
  };
  configuration: {
    type: string;
    value: string;
  };
  serialNumber: {
    value: string;
    isValid: boolean;
  };
  posId: {
    value: string;
    isValid: boolean;
  };
  apikey: {
    value: string;
    isValid: boolean;
  };
  testMode: boolean;
}

export interface ISPIAttribute {
  [attribute: string]: Record<string, unknown>;
}

export interface ISPIUpdatedData {
  value?: string;
  modalToggle?: boolean;
  isValid?: boolean;
  type?: string;
  testMode?: boolean;
}

export interface ISPIFormDataValidator {
  providerValid: boolean;
  serialNumberValid: boolean;
  posIdValid: boolean;
}

export type IFormEventValue = React.ChangeEvent<{ value: unknown }>;

export type IFormEventCheckbox = React.ChangeEvent<{ checked: boolean }>;

export type IFormEventKey = React.KeyboardEvent<{ key: string }>;
