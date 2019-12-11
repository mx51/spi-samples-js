import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import OrderCheckout from '../OrderCheckout/OrderCheckout';
import Tick from '../Tick';
import './Checkout.css';

function Checkout(props: { visible: Boolean; list: any; onClose: Function; onNoThanks: Function }) {
  const { visible, list, onClose, onNoThanks } = props;

  // function toggle() {
  //   document.body.classList.toggle('flyout-toggle');
  // }

  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalPaidAmount, settotalPaidAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false);

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);

  function checkTransactionStatus(paid: number) {
    if (totalBillAmount <= paid) {
      setTransactionStatus(true);
    }
  }

  function submitAmount() {
    // settotalPaidAmount(totalPaidAmount - totalBillAmount);
    setTotalPaid(totalPaid + totalPaidAmount);
    checkTransactionStatus(totalPaid + totalPaidAmount);
  }

  function enterPredefinedAmount(amount: number) {
    setTotalPaid(totalPaid + amount);
    checkTransactionStatus(totalPaid + amount);
  }

  function handleNoThanks() {
    onNoThanks();
    setTransactionStatus(false);
    setTotalPaid(0);
  }

  function paymentOption() {
    return (
      <div className="payment-options">
        <h2>Total ${totalBillAmount}</h2>
        <hr />
        <div className="fastcash-div">
          <p className="fastcash-heading">Fast cash options</p>
          <button type="button" onClick={() => enterPredefinedAmount(5)}>
            $5
          </button>
          <button type="button" onClick={() => enterPredefinedAmount(10)}>
            $10
          </button>
          <button type="button" onClick={() => enterPredefinedAmount(20)}>
            $20
          </button>
          <button type="button" onClick={() => enterPredefinedAmount(30)}>
            $30
          </button>
          <button type="button" onClick={() => enterPredefinedAmount(40)}>
            $40
          </button>
          <button type="button" onClick={() => enterPredefinedAmount(50)}>
            $50
          </button>

          <div>
            <input
              className="fastcash-input"
              placeholder="Enter total amount"
              type="number"
              onChange={e => settotalPaidAmount(parseInt(e.target.value, 10))}
            />
            <button className="fastcash-input" type="button" onClick={() => submitAmount()}>
              More cash option
            </button>
          </div>
          <div>
            <p> Other payment options</p>
            <button className="fastcash-card" type="button">
              Credit Card
            </button>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className={`checkout-page ${visible ? '' : 'd-none'}`}>
      <Col sm={3} className="checkout-order">
        <OrderCheckout list={list} totalBillAmount={totalBillAmount} totalPaidAmount={totalPaid} onClose={onClose} />
      </Col>
      <Col sm={9}>
        <div className="checkout-page-flyout">
          <button type="button" className="checkout-flyout-toggle" onClick={() => onClose()}>
            {'▼'}
          </button>

          {!transactionStatus ? paymentOption() : transactionSuccessful()}
        </div>
      </Col>
    </div>
  );
}

export default Checkout;
