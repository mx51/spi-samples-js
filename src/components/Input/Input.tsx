import React from 'react';
import './Input.css';

function Input(props: { id: string; label: string; name: string; onChange?: Function; value?: string }) {
  const { id, label, name, onChange, value } = props;
  console.log(id, label, name, value);

  return (
    <fieldset className="input p-2">
      <legend className="w-auto">{label}</legend>
      {value ? (
        <input
          id={id}
          type="text"
          value={value}
          required
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      ) : (
        <input
          id={id}
          type="text"
          required
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      )}
    </fieldset>
  );
}

export default Input;
