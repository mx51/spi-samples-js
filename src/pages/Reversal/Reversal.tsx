import React, { useState } from 'react';
import './Reversal.scss';
import { Input } from '../../components/Input';

type Props = {
  spi: Spi;
};

function Reversal({ spi }: Props) {
  const [posRefId, setPosRefId] = useState('');

  return (
    <div>
      <h2 className="sub-header">Reversal</h2>
      <div className="alignment">
        <Input
          id="inpPostId"
          name="POS Ref ID"
          label="POS Ref ID"
          placeholder="POS Ref ID"
          required
          defaultValue={posRefId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPosRefId(e.target.value);
          }}
        />
        <button type="button" className="primary-button" onClick={() => spi.InitiateReversal(posRefId)}>
          Reversal
        </button>
      </div>
    </div>
  );
}

export default Reversal;
