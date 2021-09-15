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
    isValid: boolean;
    modalToggle: boolean;
    value: string;
  };
  configuration: {
    isValid: boolean;
    type: string;
    value: string;
  };
  serialNumber: {
    isValid: boolean;
    value: string;
  };
  posId: {
    isValid: boolean;
    value: string;
  };
  testMode: boolean;
}

export interface ISPIAttribute {
  [attribute: string]: Record<string, unknown>;
}

export interface ISPIFormDataValidator {
  posIdValid: boolean;
  providerValid: boolean;
  serialNumberValid: boolean;
}

export type IFormEventValue = React.ChangeEvent<{ value: unknown }>;

export type IFormEventCheckbox = React.ChangeEvent<{ checked: boolean }>;

export type IFormEventKey = React.KeyboardEvent<{ key: string }>;
