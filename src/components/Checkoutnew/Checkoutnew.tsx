/* eslint no-else-return: "error" */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TransactionOptions, SuccessState, PurchaseResponse, Logger } from '@assemblypayments/spi-client-js';

import { Col, Row } from 'react-bootstrap';
import './Checkoutnew.css';
import Tick from '../Tick';
import OrderPay from '../OrderPay/OrderPay';
import RefundPay from '../RefundPay/RefundPay';
import CashOutPay from '../CashOutPay/CashOutPay';
import PosUtils from '../../services/_common/pos';
import {
  purchase as purchaseService,
  moto as motoService,
  transactionFlow as transactionFlowService,
  refund as refundService,
  cashout as cashoutService,
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
  const flowEl = useRef<HTMLDivElement>(null);
  const receiptEl = useRef<HTMLPreElement>(null);

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
  const totalAmount = totalBillAmount + surchargeAmount / 100;

  function handleNoThanks() {
    console.log(totalPaid);
    console.log(onNoThanks, surchargeAmount);
    onNoThanks();
    // setTransactionStatus(false);
    setTotalPaid(0);
    setSurchargeAmount(0);
  }

  function handleMotoPay() {
    motoService.initiateMotoPurchase({ Info: () => {} }, spi, parseInt(totalAmount, 10) * 100, 0, false);
    setTransactionStatus(true);
  }

  function handleCreditCardPay(tipAmount: number, cashoutAmount: number) {
    purchaseService.initiatePurchase(
      { Info: () => {} },
      new TransactionOptions(),
      spi,
      parseInt(totalAmount, 10) * 100,
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

  function handleCashoutPay(cashoutAmount: number) {
    console.log(cashoutAmount);
    cashoutService.initiateCashout({ Info: () => {} }, console, spi, cashoutAmount, surchargeAmount);
    setTransactionStatus(true);
  }
  function handleBack() {
    if (purchaseState.Finished) {
      onNoThanks();
      setTotalPaid(0);
      setSurchargeAmount(0);
    }
    setPurchaseState({ Finished: false, Success: '', Response: '' });
    setTransactionStatus(false);

    if (flowEl.current !== null) {
      flowEl.current.innerHTML = '';
    }
    if (receiptEl.current !== null) {
      receiptEl.current.innerHTML = '';
    }

    onClose();
  }

  function showRelatedPay() {
    if (isRefund) {
      return <RefundPay handleRefundPay={handleRefundPay} />;
    } else if (!isRefund && list.length === 0) {
      return <CashOutPay handleCashoutPay={handleCashoutPay} />;
    }
    return (
      <OrderPay handleCreditCardPay={handleCreditCardPay} handleMotoPay={handleMotoPay} totalAmount={totalAmount} />
    );
  }
  console.log(showRelatedPay);

  function transactionSuccessful() {
    // if (purchaseState.Finished)
    //   console.log('.................', new PurchaseResponse(purchaseState.Response).GetResponseText());
    return (
      <div>
        {!purchaseState.Finished && (
          <div className="transaction-successful">
            <p>Processing Transaction</p>
            <button type="button" onClick={() => transactionFlowService.cancelTransaction(spi)}>
              Cancel
            </button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Failed === purchaseState.Success && (
          <div className="transaction-successful">
            <p>{new PurchaseResponse(purchaseState.Response).GetResponseText()}</p>
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
        <button
          type="button"
          disabled={transactionStatus}
          className="primary-button checkout-button mb-0"
          onClick={() => handleBack()}
        >
          Back
        </button>
      </Col>
      <Col sm={10}>
        <div className="checkout-page-flyout">
          <button
            type="button"
            disabled={transactionStatus}
            className="checkout-flyout-toggle"
            onClick={() => handleBack()}
          >
            {'▼'}
          </button>
          <Row>
            <Col sm={4} className="sub-column">
              {showRelatedPay()}
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
