import React, { useState, SyntheticEvent, useCallback, useEffect } from 'react';
import { DeviceAddressResponseCode, SpiStatus } from '@mx51/spi-client-js';
import { Modal, Button } from 'react-bootstrap';
import Input from '../Input/Input';
import Checkbox from '../Checkbox/Checkbox';
// import { pairing } from '../../services';

type Props = {
  spi: any;
  status: string;
};

function Setting({ spi, status }: Props) {
  const [posId, setPosId] = useState(window.localStorage.getItem('posID') || '');
  const [serial, setSerial] = useState(window.localStorage.getItem('serial') || '');
  const [eftpos, setEftpos] = useState(window.localStorage.getItem('eftpos_address') || '');
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('') || 'RamenPosDeviceIpApiKey');
  const [testMode, setTestMode] = useState(window.localStorage.getItem('test_mode') === 'true');
  const [autoAddress, setAutoAddress] = useState(window.localStorage.getItem('auto_address') === 'true');
  const [secureWebSocket, setSecureWebSocket] = useState(
    window.localStorage.getItem('use_secure_web_sockets') === 'true'
  );

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    console.log('location', window.location.protocol);
    if (window.location.protocol === 'https:') {
      setSecureWebSocket(true);
      setAutoAddress(true);
      setTestMode(true);
    }
  });

  const handleAutoAddressStateChange = useCallback((event: any) => {
    console.log('.......eventdetail', event.detail);
    const deviceAddressStatus = event.detail;
    switch (deviceAddressStatus.DeviceAddressResponseCode) {
      case DeviceAddressResponseCode.SUCCESS:
        setEftpos(deviceAddressStatus.Address);
        window.localStorage.setItem('eftpos_address', deviceAddressStatus.Address);
        setErrorMsg(`Device Address has been updated to ${deviceAddressStatus.Address}`);
        break;
      case DeviceAddressResponseCode.INVALID_SERIAL_NUMBER:
        setEftpos('');
        window.localStorage.setItem('eftpos_address', '');
        setErrorMsg(`The serial number is invalid!`);
        break;
      default:
        console.log('The serial number is invalid!.......');
        break;
    }
  }, []);
  useEffect(() => {
    document.addEventListener('DeviceAddressChanged', handleAutoAddressStateChange);
    return function cleanup() {
      document.removeEventListener('DeviceAddressChanged', handleAutoAddressStateChange);
    };
  });

  function handlePairingSaveSetting(e: React.SyntheticEvent) {
    e.preventDefault();
    spi.SetPosId(posId);
    spi.SetTestMode(testMode);
    spi.SetSerialNumber(serial);
    spi.SetDeviceApiKey(apiKey);
    spi.SetTestMode(testMode);
    spi.SetSecureWebSockets(secureWebSocket);
    spi.SetAutoAddressResolution(autoAddress);
    spi.SetEftposAddress(eftpos);
    window.localStorage.setItem('eftpos_address', eftpos);
    window.localStorage.setItem('posID', posId);
    window.localStorage.setItem('serial', serial);
    window.localStorage.setItem('test_mode', testMode.toString());
    window.localStorage.setItem('auto_address', autoAddress.toString());
    window.localStorage.setItem('use_secure_web_sockets', secureWebSocket.toString());
  }
  const isDisabled = status !== SpiStatus.Unpaired;

  return (
    <div>
      <h2 className="sub-header">Pairing configuration</h2>
      <div className="ml-4 mr-4">
        <Modal show={errorMsg !== ''} onHide={() => setErrorMsg('')}>
          <Modal.Header closeButton>
            <Modal.Title>Alert</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{errorMsg}</p>
            <Button variant="primary" className="btn-custom" onClick={() => setErrorMsg('')} block>
              OK
            </Button>
          </Modal.Body>
        </Modal>
        <form onSubmit={(e: React.SyntheticEvent) => handlePairingSaveSetting(e)}>
          <Input
            id="POS ID"
            name="POS ID"
            label="POS ID"
            placeholder="POS ID"
            pattern="\w+"
            required
            title="No special character Only alphanumeric"
            disabled={isDisabled}
            defaultValue={posId}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setPosId(e.currentTarget.value);
              }
            }}
          />
          <Input
            id="API key"
            name="API key"
            disabled={isDisabled}
            label="API key"
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setApiKey(e.currentTarget.value);
              }
            }}
            defaultValue="RamenPosDeviceIpApiKey"
          />
          <Input
            id="serial"
            name="serial"
            label="Serial"
            defaultValue={serial}
            placeholder="000-000-000"
            required={autoAddress === true}
            disabled={isDisabled}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setSerial(e.currentTarget.value);
              }
            }}
          />
          <Input
            id="EFTPOS"
            name="EFTPOS"
            label="EFTPOS"
            placeholder="00.000.0.000"
            disabled={autoAddress || isDisabled}
            required
            defaultValue={eftpos}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setEftpos(e.currentTarget.value);
              }
            }}
          />
          <div>
            <Checkbox
              type="checkbox"
              id="Test Mode"
              label="Test Mode"
              checked={testMode}
              disabled={window.location.protocol !== 'http:' || isDisabled}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                if (e && e.currentTarget) {
                  setTestMode(e.currentTarget.checked);
                }
              }}
            />
            <Checkbox
              type="checkbox"
              id="Secure WebSockets"
              label="Secure WebSockets"
              disabled={window.location.protocol !== 'http:' || isDisabled}
              checked={secureWebSocket}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                if (e && e.currentTarget) {
                  setSecureWebSocket(e.currentTarget.checked);
                  setAutoAddress(e.currentTarget.checked);
                }
              }}
            />
            <Checkbox
              type="checkbox"
              id="Auto Address"
              label="Auto Address"
              disabled={window.location.protocol !== 'http:' || isDisabled}
              checked={autoAddress}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                if (e && e.currentTarget && !secureWebSocket) {
                  setAutoAddress(e.currentTarget.checked);
                }
              }}
            />
            <button type="submit" className="primary-button" disabled={isDisabled}>
              Save Setting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Setting;
