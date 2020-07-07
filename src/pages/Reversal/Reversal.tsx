import React from 'react';
import './Reversal.scss';
import { Input } from '../../components/Input';
import SpiService from '../Burger/spiService';

type Props = {
  spi: Spi;
};

function Reversal({ spi }: Props) {
  return (
    <div>
      <h2 className="sub-header">Reversal</h2>
      <div className="alignment">
        <Input
          id="inpPostId"
          name="POS Ref ID"
          label="POS Ref ID"
          placeholder="POS Ref ID"
          pattern="\w+"
          required
          // defaultValue={posId}
        />
        <button
          type="button"
          className="primary-button"
          onClick={() => spi.InitiateReversal('purchase-2020-07-07T00:51:45.912Z')}
        >
          Reversal
        </button>
      </div>
    </div>
  );
}

export default Reversal;
