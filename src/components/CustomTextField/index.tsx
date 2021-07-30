import React from 'react';
import ThemeTextField from './index.styles';
import { ICustomTextField } from './interfaces';

function CustomTextField({
  className,
  disabled,
  error,
  fullWidth,
  helperText,
  id,
  InputProps,
  label,
  margin,
  onBlur,
  onChange,
  required,
  value,
  variant,
}: ICustomTextField): React.ReactElement {
  return (
    <ThemeTextField
      className={className}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      helperText={helperText}
      id={id}
      InputProps={InputProps}
      label={label}
      margin={margin}
      onBlur={onBlur}
      onChange={onChange}
      required={required}
      value={value}
      variant={variant}
    />
  );
}

export default CustomTextField;
