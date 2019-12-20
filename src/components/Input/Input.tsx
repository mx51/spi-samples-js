import React from 'react';
import './Input.css';

function Input(props: { id: string; label: string; name: string; onChange?: Function; value?: string }) {
  const { id, label, name, onChange, value } = props;
  console.log(id, label, name, value);

  return (
    <div className="group">
      <span className="highlight" />
      <span className="bar" />
      {value ? (
        <input
          className="setting-input"
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
          className="setting-input"
          id={id}
          type="text"
          required
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      )}

      <label className="setting-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default Input;
