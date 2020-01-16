/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TransactionOptions, SuccessState, PurchaseResponse, Logger } from '@assemblypayments/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import './Checkoutnew.css';
import Tick from '../Tick';
import OrderPay from '../OrderPay/OrderPay';
import RefundPay from '../RefundPay/RefundPay';
import PosUtils from '../../services/_common/pos';
import {
  purchase as purchaseService,
  moto as motoService,
  transactionFlow as transactionFlowService,
  refund as refundService,
} from '../../services';

// import { moto as motoService } from '../../services';

function CheckoutNew(props: {
  visible: Boolean;
  list: any;
  onClose: Function;
  onNoThanks: Function;
  spi: any;
  surchargeAmount: number;
  setSurchargeAmount: Function;
  // purchaseState: any;
  setTransactionStatus: any;
  transactionStatus: any;
  isRefund: boolean;
}) {
  const {
    onClose,
    visible,
    onNoThanks,
    spi,
    list,
    surchargeAmount,
    setSurchargeAmount,
    // purchaseState,
    setTransactionStatus,
    transactionStatus,
    isRefund,
  } = props;
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const flowEl = useRef(null);
  const receiptEl = useRef(null);

  const [purchaseState, setPurchaseState] = useState({ Finished: false, Success: '', Response: '' });
  const handlePurchaseStatusChange = useCallback((event: any) => {
    setPurchaseState({ ...event.detail });
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    console.log('???', event.detail);
    if (event.detail.Finished) {
      console.log(receipt);
      PosUtils.processCompletedEvent(flowMsg, receipt, purchaseService, event.detail);
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

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);

  function handleNoThanks() {
    console.log(totalPaid);
    console.log(onNoThanks, surchargeAmount);
    onNoThanks();
    // setTransactionStatus(false);
    setTotalPaid(0);
    setSurchargeAmount(0);
  }

  function handleMotoPay() {
    motoService.initiateMotoPurchase({ Info: () => {} }, spi, parseInt(totalBillAmount, 10) * 100, 0, false);
    setTransactionStatus(true);
  }

  function handleCreditCardPay(tipAmount: number, cashoutAmount: number) {
    purchaseService.initiatePurchase(
      { Info: () => {} },
      new TransactionOptions(),
      spi,
      parseInt(totalBillAmount, 10) * 100,
      tipAmount,
      cashoutAmount,
      0,
      false
    );
    setTransactionStatus(true);
  }
  function handleRefundPay(refundAmount: number) {
    refundService.initiateRefund({ Info: () => {} }, spi, refundAmount * 100, false);
    setTransactionStatus(true);
  }

  function transactionSuccessful() {
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
            <button type="button" onClick={() => handleNoThanks()}>
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
              <button type="button" onClick={() => handleNoThanks()}>
                No Thanks!!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // function Cash() {
  //   return (
  //     <div className="ml-4 mr-4">
  //       <p>Cash-Moto</p>
  //     </div>
  //   );
  // }

  console.log('visible.......', visible);
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
              {isRefund ? (
                <RefundPay handleRefundPay={handleRefundPay} />
              ) : (
                <OrderPay
                  handleCreditCardPay={handleCreditCardPay}
                  handleMotoPay={handleMotoPay}
                  totalBillAmount={totalBillAmount}
                />
              )}
            </Col>
            <Col sm={5} className="sub-column">
              <h2 className="sub-header mb-0">Flow</h2>
              <div ref={flowEl} />
              {!transactionStatus ? '' : transactionSuccessful()}
            </Col>
            <Col sm={3} className="sub-column">
              <h2 className="sub-header mb-0">Receipt</h2>
              <pre className="receipt-alignment" ref={receiptEl}>
                {purchaseState.Response && new PurchaseResponse(purchaseState.Response).GetCustomerReceipt().trim()}
              </pre>
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default CheckoutNew;
