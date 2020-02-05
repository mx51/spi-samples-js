import React from 'react';
import { Logger } from '@assemblypayments/spi-client-js';

import {
  settlement as settlementService,
  settlementEnquiry as settlementEnquiryService,
  // terminalStatus as terminalStatusService,
} from '../../services';

function Actions(props: {
  spi: any;
  setActionType: Function;
  flowEl: any;
  getTerminalStatus: Function;
  receiptEl: any;
}) {
  const { spi, setActionType, flowEl, getTerminalStatus, receiptEl } = props;
  const receipt = new Logger(receiptEl.current);
  console.log(receipt);
  return (
    <div>
      <h2 className="sub-header">Actions</h2>
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          const flowMsg = new Logger(flowEl.current);
          setActionType('SETTLEMENT');
          console.log('clicked settlement');
          if (receiptEl.current !== null) {
            receiptEl.current.innerHTML = '';
          }
          settlementService.initiateSettlement(flowMsg, spi);
          console.log('flow.........', flowMsg);
        }}
      >
        Settlement
      </button>
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          const flowMsg = new Logger(flowEl.current);
          setActionType('SETTLEMENT_ENQUIRY');
          if (receiptEl.current !== null) {
            receiptEl.current.innerHTML = '';
          }
          settlementEnquiryService.initiateSettlementEnquiry(flowMsg, spi);
          console.log('flow.........', flowMsg);
        }}
      >
        Settlement Enquiry
      </button>
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          if (receiptEl.current !== null) {
            receiptEl.current.innerHTML = '';
          }
          getTerminalStatus(spi);
        }}
      >
        Terminal Status
      </button>
    </div>
  );
}

export default Actions;
