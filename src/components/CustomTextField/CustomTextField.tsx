import React from 'react';
import ThemeTextField from './index.styles';
import { ICustomTextField } from './interfaces';

const CustomTextField = React.forwardRef<HTMLInputElement, ICustomTextField>(
  (
    {
      className,
      disabled,
      error,
      fullWidth,
      helperText,
      dataTestId,
      InputProps,
      inputProps,
      label,
      margin,
      onBlur,
      onChange,
      required,
      value,
      variant,
    },
    ref
  ): React.ReactElement => (
    <ThemeTextField
      className={className}
      data-test-id={dataTestId}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      helperText={helperText}
      InputProps={InputProps}
      inputProps={inputProps}
      label={label}
      margin={margin}
      onBlur={onBlur}
      onChange={onChange}
      required={required}
      value={value}
      variant={variant}
      inputRef={ref}
    />
  )
);

export default CustomTextField;
