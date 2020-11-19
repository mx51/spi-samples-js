import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Input } from '../Input';
import Checkbox from '../Checkbox';
import { addTerminal as addTerminalAction } from '../../features/terminals/terminalSlice';

const mapDispatchToProps = {
  addTerminal: addTerminalAction,
};

function Unpair(props: any) {
  const { addTerminal } = props;
  const [posId, setPosId] = useState('');
  const [eftpos, setEftpos] = useState('');
  const [autoAddress, setAutoAddress] = useState(false);

  return (
    <div className="mt-3">
      <div>
        <h4>EFTPOS Terminal Pairing</h4>
        <form
          id="formPairingConfig"
          onSubmit={(e: React.SyntheticEvent) => {
            addTerminal({ posId, eftpos, autoAddress });
            console.log(posId, eftpos, autoAddress);
            e.preventDefault();
            return false;
          }}
        >
          <Input
            id="inpPostId"
            name="POS ID"
            label="POS ID"
            placeholder="POS ID"
            pattern="^[a-zA-Z0-9]{1,16}$"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPosId(e.target.value);
            }}
            title="POS Id must be alphanumeric and less than 16 characters. Special characters and spaces not allowed"
          />

          <Input
            id="inpEFTPOS"
            name="EFTPOS"
            label="EFTPOS"
            placeholder="000.000.000.000"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEftpos(e.target.value);
            }}
          />
          <div>
            <Checkbox
              type="checkbox"
              id="ckbAutoAddress"
              label="Auto Address"
              checked={autoAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAutoAddress(e.target.checked);
              }}
            />
            <button id="btnSaveSetting" type="submit" className="btn btn-primary rounded-0 btn-block btn-lg mb-2">
              Pair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(Unpair);
