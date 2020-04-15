import React from 'react';
import { Logger, SpiStatus } from '@mx51/spi-client-js';
import { Modal, Button } from 'react-bootstrap';

import { settlement as settlementService, settlementEnquiry as settlementEnquiryService } from '../../services';

function settlementEnquiry(status: string, onErrorMsg: Function, setActionType: Function, receiptEl: any, flowEl: any) {
  if (status !== SpiStatus.PairedConnected && SpiStatus.PairedConnecting) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    const flowMsg = new Logger(flowEl.current);
    setActionType('SETTLEMENT_ENQUIRY');
    if (receiptEl.current !== null) {
      // eslint-disable-next-line no-param-reassign
      receiptEl.current.innerHTML = '';
    }
    settlementEnquiryService.initiateSettlementEnquiry(flowMsg, spi);
  }
}

function settlement(
  status: string,
  onErrorMsg: Function,
  setActionType: Function,
  receiptEl: any,
  flowEl: any,
  spi: any
) {
  if (status !== SpiStatus.PairedConnected && SpiStatus.PairedConnecting) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    const flowMsg = new Logger(flowEl.current);
    setActionType('SETTLEMENT');
    if (receiptEl.current !== null) {
      // eslint-disable-next-line no-param-reassign
      receiptEl.current.innerHTML = '';
    }
    settlementService.initiateSettlement(flowMsg, spi);
  }
}

function terminalStatus(status: string, onErrorMsg: Function, receiptEl: any, spi: any, getTerminalStatus: Function) {
  if (status !== SpiStatus.PairedConnected && SpiStatus.PairedConnecting) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    if (receiptEl.current !== null) {
      // eslint-disable-next-line no-param-reassign
      receiptEl.current.innerHTML = '';
    }
    getTerminalStatus(spi);
  }
}
function Actions(props: {
  spi: any;
  setActionType: Function;
  flowEl: any;
  getTerminalStatus: Function;
  receiptEl: any;
  status: string;
  errorMsg: string;
  onErrorMsg: Function;
}) {
  const { spi, setActionType, flowEl, getTerminalStatus, receiptEl, status, errorMsg, onErrorMsg } = props;

  function handleSettlementEnquiry() {
    settlementEnquiry(status, onErrorMsg, setActionType, receiptEl, flowEl);
  }

  function handleSettlement() {
    settlement(status, onErrorMsg, setActionType, receiptEl, flowEl, spi);
  }

  function handleTerminalStatus() {
    terminalStatus(status, onErrorMsg, receiptEl, spi, getTerminalStatus);
  }

  return (
    <div>
      <h2 className="sub-header">Actions</h2>
      <Modal show={errorMsg !== ''} onHide={() => onErrorMsg('')}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMsg}</p>
          <Button variant="primary" className="btn-custom" onClick={() => onErrorMsg('')} block>
            OK
          </Button>
        </Modal.Body>
      </Modal>
      <button type="button" className="primary-button" onClick={() => handleSettlement()}>
        Settlement
      </button>
      <button type="button" className="primary-button" onClick={() => handleSettlementEnquiry()}>
        Settlement Enquiry
      </button>
      <button type="button" className="primary-button" onClick={() => handleTerminalStatus()}>
        Terminal Status
      </button>
    </div>
  );
}

export default Actions;
