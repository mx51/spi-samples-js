import React from 'react';
import './Input.scss';

function Textarea(props: { id: string; label: string; name: string; onChange?: Function; value?: string }) {
  const { id, label, name, onChange, value } = props;
  console.log(id, label, name, value);

  return (
    <fieldset className="input p-2">
      <legend className="w-auto">{label}</legend>
      {value ? (
        <textarea
          id={id}
          value={value}
          required
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      ) : (
        <textarea
          id={id}
          required
          onChange={e => {
            if (onChange) onChange(e);
          }}
        />
      )}
    </fieldset>
  );
}

export default Textarea;
