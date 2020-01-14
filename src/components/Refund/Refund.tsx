import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SuccessState, PurchaseResponse, Logger } from '@assemblypayments/spi-client-js';
import './Refund.css';
import Input from '../Input/Input';
import Tick from '../Tick';
import PosUtils from '../../services/_common/pos';

import { refund as refundService, transactionFlow as transactionFlowService } from '../../services';

function Refund(props: {
  visible: Boolean;
  onClose: Function;
  spi: any;
  // purchaseState: any;
  setTransactionStatus: any;
  onNoThanks: Function;
  transactionStatus: any;
}) {
  const { onClose, visible, spi, setTransactionStatus, onNoThanks, transactionStatus } = props;
  const flowEl = useRef(null);
  const receiptEl = useRef(null);
  const [purchaseState, setPurchaseState] = useState({ Finished: false, Success: '', Response: '' });
  const handlePurchaseStatusChange = useCallback((event: any) => {
    setPurchaseState({ ...event.detail });
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    console.log(event.detail);
    if (event.detail.Finished) {
      PosUtils.processCompletedEvent(flowMsg, receipt, refundService, event.detail);
    } else {
      transactionFlowService.handleTransaction(flowMsg, event.detail);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('TxFlowStateChanged', handlePurchaseStatusChange);

    return function cleanup() {
      document.removeEventListener('TxFlowStateChanged', handlePurchaseStatusChange);
    };
  });

  function transactionStateChange() {
    return (
      <div>
        {!purchaseState.Finished && (
          <div className="transaction-successful">
            <p>Processing Transaction</p>
            <button type="button">Cancel</button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Failed === purchaseState.Success && (
          <div className="transaction-successful">
            <p>Transaction Failed</p>
            <button type="button" onClick={() => onNoThanks()}>
              Sorry!! Try Again
            </button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Success === purchaseState.Success && (
          <div className="transaction-successful">
            <Tick className="color-purple" />
            <div className="transaction-successful-button">
              <p>Transaction successful!</p>
              <button
                type="button"
                onClick={() =>
                  transactionFlowService.acknowledgeCompletion({ Info: () => {}, Clear: () => {} }, spi, () => {})
                }
              >
                Receipt
              </button>
              <button type="button" onClick={() => onNoThanks()}>
                No Thanks!!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  function RefundTransaction() {
    const [RefundAmount, setRefundAmount] = useState(0);

    function refundProcess() {
      refundService.initiateRefund({ Info: () => {} }, spi, RefundAmount * 100, false);
      setTransactionStatus(true);
    }

    return (
      <div className="ml-4 mr-4">
        <Input
          id="Refund-Amount"
          name="Refund"
          label="Refund Amount"
          onChange={(e: any) => setRefundAmount(parseInt(e.target.value, 10) / 100)}
        />
        <p className="ml-2">Cents</p>
        <button className="primary-button" type="button" onClick={() => refundProcess()}>
          Refund
        </button>
      </div>
    );
  }

  return (
    <div className={`checkout-page1 ${visible ? '' : 'd-none'}`}>
      <Col sm={2} className="checkout-order min-vh-100 sticky-top">
        <button type="button" className="primary-button checkout-button" onClick={() => onClose()}>
          Back
        </button>
      </Col>
      <Col sm={10}>
        <div className="checkout-page-flyout">
          <button type="button" className="checkout-flyout-toggle" onClick={() => onClose()}>
            {'▼'}
          </button>
          <Row>
            <Col sm={4} className="sub-column">
              <h2 className="sub-header mb-0">Refund </h2>
              <Row>
                <RefundTransaction />
              </Row>
            </Col>
            <Col sm={5} className="sub-column">
              <h2 className="sub-header mb-0">Flow</h2>
              <div ref={flowEl} />
              {!transactionStatus ? '' : transactionStateChange()}
            </Col>
            <Col sm={3} className="sub-column">
              <h2 className="sub-header mb-0">Receipt</h2>
              {purchaseState.Finished && SuccessState.Success === purchaseState.Success && (
                <pre className="receipt-alignment" ref={receiptEl}>
                  {new PurchaseResponse(purchaseState.Response).GetCustomerReceipt().trim()}
                </pre>
              )}
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default Refund;
