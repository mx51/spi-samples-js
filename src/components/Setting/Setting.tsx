import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { Logger, SettleResponse } from '@assemblypayments/spi-client-js';
import SettingConfig from '../SettingConfig/SettingConfig';
import Actions from '../Actions/Actions';
import Flow from '../Flow/Flow';
import {
  settlement as settlementService,
  settlementEnquiry as settlementEnquiryService,
  terminalStatus as terminalStatusService,
  transactionFlow as transactionFlowService,
} from '../../services';
import PosUtils from '../../services/_common/pos';

function Setting(props: { spi: any }) {
  const { spi } = props;
  const flowEl = useRef();
  const receiptEl = useRef<HTMLPreElement>(null);

  const [posSetting, setPosSetting] = useState();
  const [actionType, setActionType] = useState();
  const [model, setModel] = useState('');

  const handleAction = useCallback((event: any) => {
    setPosSetting({ ...event.detail });
    console.log(posSetting);
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    if (event.detail.Finished) {
      console.log(receipt);
      if (event.detail.Response.Data.error_reason === 'HOST_DECLINED') {
        // alert('wrong date');
        setModel('Please enter current years date');
      }
      if (event.detail.Response.Data.error_reason === 'OPERATION_IN_PROGRESS') {
        setModel('Please check your terminal is paired');
      }
      let eventType = null;
      if (actionType === 'SETTLEMENT_ENQUIRY') {
        eventType = settlementEnquiryService;
      } else {
        eventType = settlementService;
      }
      PosUtils.processCompletedEvent(flowMsg, receipt, eventType, event.detail);
      spi.AckFlowEndedAndBackToIdle();
    } else {
      transactionFlowService.handleTransaction(flowMsg, event.detail);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('TxFlowStateChanged', handleAction);
    return function cleanup() {
      document.removeEventListener('TxFlowStateChanged', handleAction);
    };
  });

  // eslint-disable-next-line no-shadow
  function getTerminalStatus(spi: any) {
    spi.GetTerminalStatus();
    const flowMsg = new Logger(flowEl.current);
    // eslint-disable-next-line no-param-reassign
    spi.TerminalStatusResponse = (message: Message) =>
      terminalStatusService.handleTerminalStatusResponse(flowMsg, spi, message, () => {});
  }

  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <SettingConfig spi={spi} />
          </div>
          <div className="flex-fill">
            <Actions
              spi={spi}
              setActionType={setActionType}
              flowEl={flowEl}
              receiptEl={receiptEl}
              getTerminalStatus={getTerminalStatus}
            />
          </div>
        </Col>
        <Col lg={5} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <Flow ref={flowEl} />
          </div>
        </Col>
        <Col lg={3} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <h2 className="sub-header">receipt</h2>
            <pre className="receipt-alignment" ref={receiptEl}>
              {actionType && actionType.Response && new SettleResponse(actionType.Response).GetReceipt().trim()}
            </pre>
          </div>
        </Col>
      </Row>
      <Modal show={model !== ''} onHide={() => setModel('')}>
        <Modal.Header closeButton>
          <Modal.Title>ERROR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{model}</p>
          <Button variant="primary" className="btn-custom" onClick={() => setModel('')} block>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Setting;
