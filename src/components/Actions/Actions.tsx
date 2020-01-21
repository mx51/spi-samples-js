import React from 'react';
import {
  settlement as settlementService,
  settlementEnquiry as settlementEnquiryService,
  // terminalStatus as terminalStatusService,
} from '../../services';

function Actions(props: { spi: any }) {
  const { spi } = props;
  return (
    <div>
      <h2 className="sub-header">Actions</h2>
      <button
        type="button"
        className="primary-button"
        onClick={() => settlementService.initiateSettlement({ Info: () => {} }, spi)}
      >
        Settlement
      </button>
      <button
        type="button"
        className="primary-button"
        onClick={() => settlementEnquiryService.initiateSettlementEnquiry({ Info: () => {} }, spi)}
      >
        Settlement Enquiry
      </button>
      <button type="button" className="primary-button">
        Terminal Status
      </button>
    </div>
  );
}

export default Actions;
