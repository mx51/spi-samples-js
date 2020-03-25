import React from 'react';
import './Input.scss';

function Input(props: {
  id: string;
  label: string;
  name: string;
  onChange?: Function;
  value?: string;
  type?: string;
  disabled?: boolean;
  min?: string;
  onKeyPress?: any;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: any;
  title?: any;
  defaultValue?: any;
  required?: Boolean;
}) {
  const {
    id,
    label,
    name,
    onChange,
    value,
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
  console.log(id, label, name, value, required);

  return (
    <fieldset className="input p-2">
      <legend className={disabled ? 'text-muted w-auto' : 'w-auto'}>{label}</legend>
      {value ? (
        <input
          id={id}
          type={type || 'text'}
          disabled={disabled}
          min={min}
          onKeyPress={onKeyPress}
          value={value}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          title={title}
          required={required === true}
          defaultValue={defaultValue}
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      ) : (
        <input
          id={id}
          type={type || 'text'}
          disabled={disabled}
          min={min}
          onKeyPress={onKeyPress}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          title={title}
          required={required === true}
          defaultValue={defaultValue}
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      )}
    </fieldset>
  );
}

export default Input;
