/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TransactionOptions, SuccessState, PurchaseResponse, Logger } from '@assemblypayments/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import './Checkoutnew.css';
import Input from '../Input/Input';
import Tick from '../Tick';
import PosUtils from '../../services/_common/pos';
import {
  purchase as purchaseService,
  moto as motoService,
  transactionFlow as transactionFlowService,
} from '../../services';

// import { moto as motoService } from '../../services';

enum PaymentType {
  // Cash,
  Moto,
  CreditCard,
}

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
  } = props;
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCard);
  const flowEl = useRef(null);
  const receiptEl = useRef(null);

  const [purchaseState, setPurchaseState] = useState({ Finished: false, Success: '', Response: '' });
  const handlePurchaseStatusChange = useCallback((event: any) => {
    setPurchaseState({ ...event.detail });
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    console.log('???', event.detail);
    if (event.detail.Finished) {
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
    console.log(onNoThanks, setPaymentType, surchargeAmount);
    onNoThanks();
    // setTransactionStatus(false);
    setTotalPaid(0);
    setSurchargeAmount(0);
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

  function CreditCard() {
    const [tipAmount, setTipAmount] = useState(0);
    const [cashoutAmount, setCashoutAmount] = useState(0);

    function creditCardPay() {
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
    return (
      <div className="ml-4 mr-4">
        <Input
          id="Tip"
          name="Tip"
          label="Tip Amount"
          onChange={(e: any) => setTipAmount(parseInt(e.target.value, 10))}
        />
        <p className="ml-2">Cents</p>
        <Input
          id="cashout-amount"
          name="Cashout amount"
          label="cashout Amount"
          onChange={(e: any) => setCashoutAmount(parseInt(e.target.value, 10))}
        />
        <p className="ml-2">Cents</p>
        <button className="primary-button" type="button" onClick={() => creditCardPay()}>
          Pay
        </button>
      </div>
    );
  }
  function Moto() {
    function motoPay() {
      motoService.initiateMotoPurchase({ Info: () => {} }, spi, parseInt(totalBillAmount, 10) * 100, 0, false);
      setTransactionStatus(true);
    }
    return (
      <div className="ml-4 mr-4">
        <p>
          Please click process as Moto button <span>👇</span> to process your payment
        </p>
        <button className="primary-button" type="button" onClick={() => motoPay()}>
          MOTO
        </button>
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

  function showPaymentType() {
    switch (paymentType) {
      // case PaymentType.Cash:
      //   return <Cash />;
      case PaymentType.Moto:
        return <Moto />;
      case PaymentType.CreditCard:
        return <CreditCard />;
      default:
        return <CreditCard />;
    }
  }
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
              <h2 className="sub-header mb-0">Order total ${parseInt(totalBillAmount, 10)}</h2>
              <Row className="order-header-buttons no-gutters">
                {/* <Col sm={4}>
                  <button type="button" onClick={() => setPaymentType(PaymentType.Cash)}>
                    Cash
                  </button>
                </Col> */}
                <Col sm={6}>
                  <button type="button" onClick={() => setPaymentType(PaymentType.Moto)}>
                    Moto
                  </button>
                </Col>
                <Col sm={6}>
                  <button type="button" onClick={() => setPaymentType(PaymentType.CreditCard)}>
                    Credit card
                  </button>
                </Col>
              </Row>
              <Row>{showPaymentType()}</Row>
            </Col>
            <Col sm={5} className="sub-column">
              <h2 className="sub-header mb-0">Flow</h2>
              <div ref={flowEl} />
              {!transactionStatus ? '' : transactionSuccessful()}
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

export default CheckoutNew;
