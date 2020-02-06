import React, { useState, SyntheticEvent, useCallback, useEffect } from 'react';
import { DeviceAddressResponseCode } from '@assemblypayments/spi-client-js';
import { Form } from 'react-bootstrap';
import Input from '../Input/Input';
// import { pairing } from '../../services';
import './PairingConfig.css';

type Props = {
  spi: any;
  isPaired: boolean;
};

function Setting({ spi, isPaired }: Props) {
  const [posId, setPosId] = useState(window.localStorage.getItem('posID') || '');
  const [serial, setSerial] = useState(window.localStorage.getItem('serial') || '');
  const [eftpos, setEftpos] = useState(window.localStorage.getItem('eftpos_address') || '');
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('') || 'RamenPosDeviceIpApiKey');
  const [testMode, setTestMode] = useState(window.localStorage.getItem('test_mode') === 'true');
  const [autoAddress, setAutoAddress] = useState(window.localStorage.getItem('auto_address') === 'true');
  const [secureWebSocket, setSecureWebSocket] = useState(
    window.localStorage.getItem('use_secure_web_sockets') === 'true'
  );

  const [autoAddressState, setAutoAddressState] = useState();

  useEffect(() => {
    console.log('location', window.location.protocol);
    setSecureWebSocket(window.location.protocol !== 'http:');
  });

  const handleAutoAddressStateChange = useCallback((event: any) => {
    if (autoAddress === true && serial === '') {
      alert('Please enter serial Number');
    }
    setAutoAddressState({ ...event.detail });
    console.log('.......eventdetail', event.detail);
    console.log(autoAddressState);
    const deviceAddressStatus = event.detail;
    switch (deviceAddressStatus.DeviceAddressResponseCode) {
      case DeviceAddressResponseCode.SUCCESS:
        setEftpos(deviceAddressStatus.Address);
        window.localStorage.setItem('eftpos_address', deviceAddressStatus.Address);
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

  function handlePairingSaveSetting(e: React.SyntheticEvent) {
    e.preventDefault();

    spi.SetPosId(posId);
    spi.SetTestMode(testMode);
    spi.SetSerialNumber(serial);
    spi.SetDeviceApiKey(apiKey);
    spi.SetTestMode(testMode);
    spi.SetSecureWebSockets(secureWebSocket && autoAddress);
    spi.SetAutoAddressResolution(autoAddress);
    spi.SetEftposAddress(eftpos);
    window.localStorage.setItem('eftpos_address', eftpos);
    window.localStorage.setItem('posID', posId);
    window.localStorage.setItem('serial', serial);
    window.localStorage.setItem('test_mode', testMode.toString());
    window.localStorage.setItem('auto_address', autoAddress.toString());
    window.localStorage.setItem('use_secure_web_sockets', secureWebSocket.toString());
    return false;
  }

  return (
    <div>
      <h2 className="sub-header">Pairing configuration</h2>
      <div className="ml-4 mr-4">
        <form onSubmit={(e: React.SyntheticEvent) => handlePairingSaveSetting(e)}>
          <Input
            id="POS ID"
            name="POS ID"
            label="POS ID"
            placeholder="POS ID"
            pattern="\w+"
            title="No special character Only alphanimeric"
            disabled={isPaired}
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
            disabled={isPaired}
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
            placeholder="000-000-000"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
            minLength={0}
            maxLength={11}
            title="Please enter correct format of serial number"
            disabled={isPaired}
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
            disabled={autoAddress || isPaired}
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
              checked={testMode}
              disabled={isPaired}
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
              disabled
              checked={secureWebSocket}
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
              disabled={isPaired}
              checked={autoAddress}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                if (e && e.currentTarget) {
                  setAutoAddress(e.currentTarget.checked);
                  console.log(e.currentTarget.checked);
                }
              }}
              className="m-2"
            />
            <button type="submit" className="primary-button" disabled={isPaired}>
              Save Setting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Setting;
