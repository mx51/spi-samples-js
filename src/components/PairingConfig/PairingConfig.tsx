import React, { useState, SyntheticEvent, useCallback, useEffect } from 'react';
import { DeviceAddressResponseCode } from '@assemblypayments/spi-client-js';
import { Form } from 'react-bootstrap';
import Input from '../Input/Input';
// import { pairing } from '../../services';
import './PairingConfig.css';

type Props = {
  spi: any;
};

function Setting({ spi }: Props) {
  const [posId, setPosId] = useState(window.localStorage.getItem('posID') || '');
  const [serial, setSerial] = useState(window.localStorage.getItem('serial') || '');
  const [eftpos, setEftpos] = useState(window.localStorage.getItem('eftpos_address') || '');
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('') || 'RamenPosDeviceIpApiKey');
  const [autoAddress, setAutoAddress] = useState(
    Boolean(window.localStorage.getItem('auto_resolve_eftpos_address')) || false
  );
  const [testMode, setTestMode] = useState(Boolean(window.localStorage.getItem('test_mode')) || false);
  const [secureWebSocket, setSecureWebSocket] = useState(
    Boolean(window.localStorage.getItem('use_secure_web_sockets')) || false
  );

  const [autoAddressState, setAutoAddressState] = useState();

  const handleAutoAddressStateChange = useCallback((event: any) => {
    setAutoAddressState({ ...event.detail });
    console.log('.......eventdetail', event.detail);
    console.log(autoAddressState);
    const deviceAddressStatus = event.detail;
    switch (deviceAddressStatus.DeviceAddressResponseCode) {
      case DeviceAddressResponseCode.SUCCESS:
        setEftpos(deviceAddressStatus.Address);
        console.log(`Device Address has been updated to ${deviceAddressStatus.Address}`);
        break;
      default:
        console.log('The serial number is invalid! or The IP address have not changed!');
        break;
    }
  }, []);
  useEffect(() => {
    document.addEventListener('DeviceAddressChanged', handleAutoAddressStateChange);
    return function cleanup() {
      document.removeEventListener('DeviceAddressChanged', handleAutoAddressStateChange);
    };
  });

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
        <Input
          id="API key"
          name="API key"
          label="API key"
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setApiKey(e.currentTarget.value);
              console.log(serial);
            }
          }}
          value="RamenPosDeviceIpApiKey"
        />
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
          <Form.Check
            type="checkbox"
            id="Test Mode"
            label="Test Mode"
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setTestMode(e.currentTarget.checked);
                console.log(e.currentTarget.checked);
                console.log(testMode);
              }
            }}
            className="m-2"
          />
          <Form.Check
            type="checkbox"
            id="Secure WebSockets"
            label="Secure WebSockets"
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setSecureWebSocket(e.currentTarget.checked);
                console.log(e.currentTarget.checked);
                console.log(secureWebSocket);
              }
            }}
            className="m-2"
          />
          <Form.Check
            type="checkbox"
            id="Auto Address"
            label="Auto Address"
            className="m-2"
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setAutoAddress(e.currentTarget.checked);
                console.log(e.currentTarget.checked);
              }
            }}
          />
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              spi.SetPosId(posId);
              console.log('.......', autoAddress);
              spi.SetEftposAddress(eftpos);
              spi.SetSerialNumber(serial);
              spi.SetDeviceApiKey(apiKey);
              spi.SetTestMode(testMode);
              spi.SetSecureWebSockets(secureWebSocket);
              spi.SetAutoAddressResolution(autoAddress);
              console.log(spi);
              window.localStorage.setItem('eftpos_address', eftpos);
              window.localStorage.setItem('posID', posId);
              window.localStorage.setItem('serial', serial);
              window.localStorage.setItem('auto_address', autoAddress.toString());
              window.localStorage.setItem('use_secure_web_sockets', secureWebSocket.toString());
              window.localStorage.setItem('test_mode', testMode.toString());
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
