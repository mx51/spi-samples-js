import React from 'react';
import './Radio.scss';

function Radio(props: {
  checked?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  id: string;
  isLabelVisible?: boolean;
  label: string;
  name: string;
  onChange: Function;
  value: string;
}) {
  const { checked, children, disabled, id, isLabelVisible, label, name, onChange, value } = props;
  return (
    <div className={disabled ? 'radio-button disabled' : 'radio-button'}>
      <label htmlFor={id}>
        <input
          checked={checked}
          disabled={disabled}
          id={id}
          name={name}
          onChange={(e) => onChange(e)}
          type="radio"
          value={value}
        />
        <span className={isLabelVisible ? '' : 'sr-only'}>{label}</span>
        <span className={disabled ? 'radio-button-indicator disabled' : 'radio-button-indicator'} />
        {children}
      </label>
    </div>
  );
}

Radio.defaultProps = {
  checked: false,
  children: null,
  disabled: false,
  isLabelVisible: true,
};

export default Radio;
