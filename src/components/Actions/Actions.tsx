import React from 'react';
import { Logger } from '@assemblypayments/spi-client-js';

import {
  settlement as settlementService,
  settlementEnquiry as settlementEnquiryService,
  // terminalStatus as terminalStatusService,
} from '../../services';

function Actions(props: { spi: any; setActionType: Function; flowEl: any; getTerminalStatus: Function }) {
  const { spi, setActionType, flowEl, getTerminalStatus } = props;

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
          settlementService.initiateSettlement({ Info: () => {} }, spi);
          console.log('flow.........', flowMsg);
          flowMsg.Clear();
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
          settlementEnquiryService.initiateSettlementEnquiry({ Info: () => {} }, spi);
          console.log('flow.........', flowMsg);
          flowMsg.Clear();
        }}
      >
        Settlement Enquiry
      </button>
      <button type="button" className="primary-button" onClick={() => getTerminalStatus(spi)}>
        Terminal Status
      </button>
    </div>
  );
}

export default Actions;
