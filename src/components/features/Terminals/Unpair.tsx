import React, { useState } from 'react';
import { SpiStatus } from '@mx51/spi-client-js';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Input } from '../../Input';
import Checkbox from '../../Checkbox';

import {
  pairTerminal as pairTerminalAction,
  unpairTerminal as unpairTerminalAction,
  cancelTerminalPairing as cancelTerminalPairingAction,
} from '../../../features/terminals/terminalSlice';

const mapDispatchToProps = {
  unpairTerminal: unpairTerminalAction,
  pairTerminal: pairTerminalAction,
  cancelTerminalPairing: cancelTerminalPairingAction,
};

function Unpair(props: any) {
  const { pairTerminal, unpairTerminal, terminal, cancelTerminalPairing } = props;
  const defaultConfig = {
    posId: '',
    eftpos: '',
    serialNumber: '',
    autoAddress: false,
    testMode: true,
    secureWebSocket: false,
  };

  const config = {
    ...defaultConfig,
    ...terminal.terminalConfig,
  };

  const [posId, setPosId] = useState(config.posId);
  const [eftpos, setEftpos] = useState(config.eftpos);
  const [serialNumber, setSerialNumber] = useState(config.serialNumber);
  const [autoAddress, setAutoAddress] = useState(config.autoAddress);
  const [testMode, setTestMode] = useState(config.testMode);
  const [secureWebSocket, setSecureWebSocket] = useState(config.secureWebSocket);

  const isFinishedPairing = terminal && terminal.pairingFlow && terminal.pairingFlow.Finished;
  const disableInput = !isFinishedPairing || terminal.status !== SpiStatus.Unpaired;

  return (
    <div>
      <h2 className="sub-header">Pairing configuration</h2>
      <div className="ml-2 mr-2">
        <form
          id="formPairingConfig"
          onSubmit={(e: React.SyntheticEvent) => {
            pairTerminal(terminal.id, { posId, eftpos, autoAddress, serialNumber });
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
            defaultValue={posId}
            required
            disabled={disableInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPosId(e.target.value);
            }}
            title="POS Id must be alphanumeric and less than 16 characters. Special characters and spaces not allowed"
          />
          <Input id="inpAPIkey" name="API key" label="API key" defaultValue="BurgerPosDeviceAPIKey" />
          <Input
            id="inpSerial"
            name="serialNumber"
            label="Serial"
            placeholder="000-000-000"
            disabled={disableInput}
            defaultValue={serialNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSerialNumber(e.target.value);
            }}
          />
          <Input
            id="inpEFTPOS"
            name="EFTPOS"
            label="EFTPOS"
            placeholder="000.000.000.000"
            disabled={disableInput}
            defaultValue={eftpos}
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
              disabled={disableInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAutoAddress(e.target.checked);
              }}
            />
            <Checkbox
              type="checkbox"
              id="ckbTestMode"
              label="Test Mode"
              checked={testMode}
              disabled={disableInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTestMode(e.target.checked);
              }}
            />
            <Checkbox
              type="checkbox"
              id="ckbSecureWebSocket"
              label="Secure Web Socket"
              checked={secureWebSocket}
              disabled={disableInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSecureWebSocket(e.target.checked);
              }}
            />

            {terminal && terminal.status === SpiStatus.PairedConnected && (
              <Button
                className="btn btn-primary rounded-0 btn-block btn-lg mb-2"
                onClick={() => unpairTerminal(terminal.id)}
              >
                Unpair
              </Button>
            )}
            {!isFinishedPairing && (
              <Button
                className="btn btn-primary rounded-0 btn-block btn-lg mb-2"
                onClick={() => cancelTerminalPairing(terminal.id)}
              >
                Cancel Pairing
              </Button>
            )}
            {isFinishedPairing && terminal && terminal.status === SpiStatus.Unpaired && (
              <button id="btnSaveSetting" type="submit" className="btn btn-primary rounded-0 btn-block btn-lg mb-2">
                Pair
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(Unpair);
