import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { Logger, SettleResponse, TransactionOptions } from '@mx51/spi-client-js';
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

function Setting(props: {
  spi: any;
  status: string;
  errorMsg: string;
  onErrorMsg: Function;
  suppressMerchantPassword: boolean;
  setSuppressMerchantPassword: Function;
}) {
  const { spi, status, errorMsg, onErrorMsg, suppressMerchantPassword, setSuppressMerchantPassword } = props;
  const flowEl = useRef();
  const receiptEl = useRef<HTMLPreElement>(null);

  const [posSetting, setPosSetting] = useState();
  const [actionType, setActionType] = useState();
  const [model, setModel] = useState('');

  const handleAction = useCallback((event: any) => {
    console.log(posSetting);
    setPosSetting({ ...event.detail });
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    if (event.detail.Finished) {
      if (event.detail.Response.Data.error_reason === 'HOST_DECLINED') {
        setModel('Please enter currect date');
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
  function handleSaveSetting(
    eftposReceipt: boolean,
    sigFlow: boolean,
    printMerchantCopy: boolean,
    receiptHeader: string,
    receiptFooter: string
  ) {
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
    window.localStorage.setItem('suppress_merchant_password_input', suppressMerchantPassword.toString());
    window.localStorage.setItem('receipt_header_input', receiptHeader);
    window.localStorage.setItem('receipt_footer_input', receiptFooter);
  }

  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <SettingConfig
              suppressMerchantPassword={suppressMerchantPassword}
              setSuppressMerchantPassword={setSuppressMerchantPassword}
              handleSaveSetting={handleSaveSetting}
            />
          </div>
          <div className="flex-fill">
            <Actions
              spi={spi}
              setActionType={setActionType}
              flowEl={flowEl}
              receiptEl={receiptEl}
              getTerminalStatus={getTerminalStatus}
              status={status}
              errorMsg={errorMsg}
              onErrorMsg={onErrorMsg}
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
