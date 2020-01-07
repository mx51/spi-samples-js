/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import { TransactionOptions } from '@assemblypayments/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import './Checkoutnew.css';
import Input from '../Input/Input';
import Tick from '../Tick';
import { purchase as purchaseService, moto as motoService } from '../../services';

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
}) {
  const { onClose, visible, onNoThanks, spi, list, surchargeAmount, setSurchargeAmount } = props;
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCard);
  // function toggle() {
  //   document.body.classList.toggle('flyout-toggle');
  // }

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);

  function handleNoThanks() {
    console.log(totalPaid);
    console.log(onNoThanks, setPaymentType, surchargeAmount);
    onNoThanks();
    setTransactionStatus(false);
    setTotalPaid(0);
    setSurchargeAmount(0);
  }
  function transactionSuccessful() {
    return (
      <div className="transaction-successful">
        <Tick className="color-purple" />
        <div className="transaction-successful-button">
          <p>Transaction successful!</p>
          <button type="button">Receipt</button>
          <button type="button" onClick={() => handleNoThanks()}>
            No Thanks!!
          </button>
        </div>
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
    return (
      <div className="ml-4 mr-4">
        <p>
          Please click process as Moto button <span>👇</span> to process your payment
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() =>
            motoService.initiateMotoPurchase({ Info: () => {} }, spi, parseInt(totalBillAmount, 10) * 100, 0, false)
          }
        >
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
              {!transactionStatus ? '' : transactionSuccessful()}
            </Col>
            <Col sm={3} className="sub-column">
              <h2 className="sub-header mb-0">Receipt</h2>
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default CheckoutNew;
