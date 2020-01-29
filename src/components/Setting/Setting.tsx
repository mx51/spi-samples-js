import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
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
import './Setting.css';

function Setting(props: { spi: any }) {
  const { spi } = props;
  const flowEl = useRef();
  const receiptEl = useRef<HTMLPreElement>(null);

  const [posSetting, setPosSetting] = useState();
  const [actionType, setActionType] = useState();

  const handleAction = useCallback((event: any) => {
    setPosSetting({ ...event.detail });
    console.log(posSetting);
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    if (event.detail.Finished) {
      console.log(receipt);
      console.log('eventdetail........', event.detail);

      let eventType = null;
      if (actionType === 'SETTLEMENT_ENQUIRY') {
        eventType = settlementEnquiryService;
      } else {
        eventType = settlementService;
      }

      PosUtils.processCompletedEvent(flowMsg, receipt, eventType, event.detail);
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
            <Actions spi={spi} setActionType={setActionType} flowEl={flowEl} getTerminalStatus={getTerminalStatus} />
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
    </div>
  );
}

export default Setting;
