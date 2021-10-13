import { Dispatch, SetStateAction } from 'react';
import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';

export interface IPreventDefault {
  preventDefault: () => void;
}

export interface ISPIFormData {
  provider: {
    isValid: boolean;
    option: string;
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

export interface IPaymentType {
  terminal: ITerminalProps;
}
export interface IPairFormState {
  setSpi: Dispatch<SetStateAction<ISPIFormData>>;
  spi: ISPIFormData;
  terminal: ITerminalProps;
}
