import React from 'react';
import { Form } from 'react-bootstrap';
import './Setting.css';

function Setting() {
  return (
    <div>
      <p className="setting-header">Setting</p>
      <div className="setting-fields">
        POS ID
        <br />
        <input type="text" className="setting-inputfield" name="POS" />
        <hr />
        API key <br />
        <input type="text" className="setting-inputfield" value="BurgerPosDeviceApiKey" name="API key" />
        <hr />
        Serial #
        <br />
        <input type="text" className="setting-inputfield" name="serial" />
        <hr />
        EFTPOS address
        <br />
        <input type="text" className="setting-inputfield" name="EFTPOS" />
        <hr />
        <div className="setting-checkbox">
          <Form.Check type="checkbox" id="check-test-mode" label="Test Mode" />
          <Form.Check type="checkbox" id="check-secure-websocket" label="Secure WebSockets" />
          <Form.Check type="checkbox" id="check-auto-address" label="Auto Address" />
          <Form.Check type="checkbox" id="check-receipt-eftpos" label="Receipt from EFTPOS" />
          <Form.Check type="checkbox" id="check-sig-eftpos" label="Sig from EFTPOS" />
          <button type="button" className="setting-save-button">
            Save Setting
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
