import React from 'react';
import './Checkbox.scss';

function Checkbox(props: {
  id: string;
  label: string;
  onChange: Function;
  type: string;
  checked: boolean;
  disabled?: boolean;
}) {
  const { id, label, onChange, type, checked, disabled } = props;
  return (
    <div className={disabled ? 'text-muted' : ''}>
      <label htmlFor={id} className="container">
        <input
          type={type}
          checked={checked}
          id={id}
          onChange={(e) => {
            onChange(e);
          }}
          disabled={disabled}
        />
        {label}
        <span className={disabled ? 'checkmark text-muted' : 'checkmark'} />
      </label>
    </div>
  );
}

export default Checkbox;
