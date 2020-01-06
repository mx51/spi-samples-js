import React, { useState, SyntheticEvent } from 'react';
import { Form } from 'react-bootstrap';
import Input from '../Input/Input';
// import { pairing } from '../../services';

import './PairingConfig.css';

type Props = {
  spi: any;
};

function Setting({ spi }: Props) {
  const [posId, setPosId] = useState('');
  const [serial, setSerial] = useState('');
  const [eftpos, setEftpos] = useState('');

  return (
    <div>
      <h2 className="sub-header">Pairing configuration</h2>
      <div className="ml-4 mr-4">
        <Input
          id="POS ID"
          name="POS ID"
          label="POS ID"
          value={posId}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setPosId(e.currentTarget.value);
              console.log(posId);
            }
          }}
        />
        <Input id="API key" name="API key" label="API key" value="BurgerPosDeviceApiKey" />
        <Input
          id="serial"
          name="serial"
          label="Serial"
          value={serial}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setSerial(e.currentTarget.value);
              console.log(serial);
            }
          }}
        />
        <Input
          id="EFTPOS"
          name="EFTPOS"
          label="EFTPOS"
          value={eftpos}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setEftpos(e.currentTarget.value);
              console.log(eftpos);
            }
          }}
        />
        <div>
          <Form.Check type="checkbox" id="check-auto-address" label="Auto Address" className="m-2" />
          <Form.Check type="checkbox" id="check-receipt-eftpos" label="Receipt from EFTPOS" className="m-2" />
          <Form.Check type="checkbox" id="check-sig-eftpos" label="Sig from EFTPOS" className="m-2" />
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              console.log(spi);
              spi.SetPosId(posId);
              spi.SetEftposAddress(eftpos);
              spi.SetSerialNumber(serial);
            }}
          >
            Save Setting
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
