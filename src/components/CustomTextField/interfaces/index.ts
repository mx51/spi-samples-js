import { IFormEventValue } from '../../PairPage/PairForm/interfaces';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type InputProps = {
  endAdornment?: React.ReactNode;
};

type TInputProps = {
  maxLength?: number;
};

export interface ICustomTextField {
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  inputProps?: Partial<TInputProps>;
  InputProps?: Partial<InputProps>;
  label?: string;
  margin?: 'dense' | 'none';
  onBlur?: (event: IFormEventValue) => void;
  onChange?: (event: IFormEventValue) => void;
  required?: boolean;
  value?: string;
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
}

export interface IErrorInputAdornment {
  isValid: boolean;
}
