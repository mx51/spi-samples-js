import React, { useState, SyntheticEvent } from 'react';
import { Form } from 'react-bootstrap';

import Textarea from '../Input/Textarea';

function SettingConfig(props: { spi: any }) {
  const { spi } = props;
  const [sigFlow, setSigFlow] = useState(window.localStorage.getItem('sig_flow_from_eftpos') === 'true');
  return (
    <div>
      <h2 className="sub-header">Setting</h2>
      <div className="mr-3 ml-3">
        <Form.Check type="checkbox" id="check-receipt-eftpos" label="Receipt from EFTPOS" />
        <Form.Check
          type="checkbox"
          id="check-sig-eftpos"
          label="Sig from EFTPOS"
          checked={sigFlow}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setSigFlow(e.currentTarget.checked);
              console.log(sigFlow);
            }
          }}
        />
        <Form.Check type="checkbox" id="print-merchant-copy" label="Print Merchant Copy" />
        <Textarea id="Receipt header" name="Receipt header" label="Receipt header" />
        <Textarea id="Receipt footer" name="Receipt footer" label="Receipt footer" />
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            spi.Config.SignatureFlowOnEftpos = sigFlow;
            window.localStorage.setItem('check-sig-eftpos', sigFlow.toString());
          }}
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
}

export default SettingConfig;
