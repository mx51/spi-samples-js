import React, { useState, SyntheticEvent } from 'react';
import { TransactionOptions } from '@assemblypayments/spi-client-js';
import Checkbox from '../Checkbox/Checkbox';
// import { Form } from 'react-bootstrap';
import Textarea from '../Input/Textarea';
import { terminalStatus as terminalStatusService } from '../../services';

function SettingConfig(props: { spi: any }) {
  const { spi } = props;
  const [sigFlow, setSigFlow] = useState(window.localStorage.getItem('sig_flow_from_eftpos') === 'true');
  const [eftposReceipt, setEftposReceipt] = useState(window.localStorage.getItem('rcpt_from_eftpos') === 'true');
  const [printMerchantCopy, setPrintMerchantCopy] = useState(
    window.localStorage.getItem('print_merchant_copy_input') === 'true'
  );

  const [receiptHeader, setReceiptHeader] = useState(window.localStorage.getItem('receipt_header_input') || '');
  const [receiptFooter, setReceiptFooter] = useState(window.localStorage.getItem('receipt_footer_input') || '');
  return (
    <div>
      <h2 className="sub-header">Setting</h2>
      <div className="mr-3 ml-3">
        <Checkbox
          type="checkbox"
          id="check-receipt-eftpos"
          label="Receipt from EFTPOS"
          checked={eftposReceipt}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setEftposReceipt(e.currentTarget.checked);
              console.log(sigFlow);
            }
          }}
        />
        <Checkbox
          type="checkbox"
          id="check-sig-eftpos"
          label="Sig from EFTPOS"
          checked={sigFlow}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setSigFlow(e.currentTarget.checked);
              console.log(e.currentTarget.checked);
            }
          }}
        />
        <Checkbox
          type="checkbox"
          id="print-merchant-copy"
          label="Print Merchant Copy"
          checked={printMerchantCopy}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setPrintMerchantCopy(e.currentTarget.checked);
              console.log(printMerchantCopy);
            }
          }}
        />
        <Textarea
          id="Receipt header"
          name="Receipt header"
          label="Receipt header"
          value={receiptHeader}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setReceiptHeader(e.currentTarget.value);
              console.log(receiptHeader);
            }
          }}
        />
        <Textarea
          id="Receipt footer"
          name="Receipt footer"
          label="Receipt footer"
          value={receiptFooter}
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            if (e && e.currentTarget) {
              setReceiptFooter(e.currentTarget.value);
              console.log(receiptFooter);
            }
          }}
        />
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            spi.Config.PromptForCustomerCopyOnEftpos = eftposReceipt;
            spi.Config.SignatureFlowOnEftpos = sigFlow;
            terminalStatusService.setIsMerchantReceiptPrinted(
              { Info: () => {}, Clear: () => {} },
              spi,
              printMerchantCopy,
              () => {}
            );
            terminalStatusService.setCustomReceiptStrings(
              { Info: () => {}, Clear: () => {} },
              new TransactionOptions(),
              spi,
              () => {},
              receiptHeader,
              receiptFooter,
              receiptHeader,
              receiptFooter
            );
            window.localStorage.setItem('rcpt_from_eftpos', eftposReceipt.toString());
            window.localStorage.setItem('sig_flow_from_eftpos', sigFlow.toString());
            window.localStorage.setItem('print_merchant_copy_input', printMerchantCopy.toString());
            window.localStorage.setItem('receipt_header_input', receiptHeader);
            window.localStorage.setItem('receipt_footer_input', receiptFooter);
          }}
        >
          Save &amp; Apply
        </button>
      </div>
    </div>
  );
}

export default SettingConfig;
