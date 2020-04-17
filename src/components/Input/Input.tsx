import React from 'react';
import './Input.scss';

function Input(props: {
  id: string;
  label: string;
  name: string;
  onChange?: Function;
  type?: string;
  disabled?: boolean;
  min?: string;
  onKeyPress?: Function;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  title?: string;
  defaultValue?: string;
  required?: Boolean;
}) {
  const {
    id,
    label,
    name,
    onChange,
    type,
    disabled,
    min,
    onKeyPress,
    pattern,
    maxLength,
    minLength,
    placeholder,
    title,
    defaultValue,
    required,
  } = props;

  return (
    <fieldset className="input p-2">
      <legend className={disabled ? 'text-muted w-auto' : 'w-auto'}>{label}</legend>

      <input
        id={id}
        name={name}
        type={type || 'text'}
        disabled={disabled}
        min={min}
        onKeyPress={(e) => {
          if (onKeyPress) onKeyPress(e);
        }}
        pattern={pattern}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        title={title}
        required={required === true}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (onChange) onChange(e);
        }}
      />
    </fieldset>
  );
}

export default Input;
