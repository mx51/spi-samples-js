import React from 'react';
import { Form } from 'react-bootstrap';

import Textarea from '../Input/Textarea';

function SettingConfig() {
  return (
    <div>
      <p className="setting-header">Setting</p>
      <div className="setting-checkbox">
        <Form.Check type="checkbox" id="check-receipt-eftpos" label="Receipt from EFTPOS" />
        <Form.Check type="checkbox" id="check-sig-eftpos" label="Sig from EFTPOS" />
        <Form.Check type="checkbox" id="print-merchant-copy" label="Print Merchant Copy" />
        <Textarea id="API key" name="Receipt header" label="Receipt header" />
        <Textarea id="API key" name="Receipt footer" label="Receipt footer" />
        <button type="button" className="setting-save-button">
          Save & Apply
        </button>
      </div>
    </div>
  );
}

export default SettingConfig;
