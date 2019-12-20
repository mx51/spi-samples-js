import React, { useState } from 'react';
import { TransactionOptions } from '@assemblypayments/spi-client-js';
import { Col } from 'react-bootstrap';
import OrderCheckout from '../OrderCheckout/OrderCheckout';
import Tick from '../Tick';
import './Checkout.css';
import Input from '../Input/Input';
import { purchase as purchaseService, moto as motoService, refund as refundService } from '../../services';
// import { moto as motoService } from '../../services';

function Checkout(props: { visible: Boolean; list: any; onClose: Function; onNoThanks: Function; spi: any }) {
  const { visible, list, onClose, onNoThanks, spi } = props;

  // function toggle() {
  //   document.body.classList.toggle('flyout-toggle');
  // }

  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalPaidAmount, settotalPaidAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false);
  const [cashoutAmount, setCashoutAmount] = useState(0);

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const total = parseInt(totalBillAmount, 10) + cashoutAmount;
  function checkTransactionStatus(paid: number) {
    if (totalBillAmount + cashoutAmount <= paid) {
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
        <h2>Total ${total}</h2>
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
            <p> Card payment options</p>
            <button
              className="fastcash-card"
              type="button"
              onClick={() =>
                purchaseService.initiatePurchase(
                  { Info: () => {} },
                  new TransactionOptions(),
                  spi,
                  total * 100,
                  0,
                  0,
                  0,
                  false
                )
              }
            >
              Credit Card
            </button>
            <button
              className="fastcash-card"
              type="button"
              onClick={() => motoService.initiateMotoPurchase({ Info: () => {} }, spi, total * 100, 0, false)}
            >
              MOTO
            </button>
            <button
              className="fastcash-card"
              type="button"
              onClick={() => refundService.initiateRefund({ Info: () => {} }, spi, total * 100, false)}
            >
              Refund
            </button>
          </div>
          <div>
            <p> Other options</p>
            <Input
              id="cashoutAmount"
              name="cashoutAmount"
              value={cashoutAmount === 0 ? '' : cashoutAmount.toString()}
              label="Cashout Amount"
              onChange={(e: any) => {
                const cashOut = e.target.value ? parseInt(e.target.value, 10) : 0;

                setCashoutAmount(cashOut);
                console.log(cashoutAmount);
              }}
            />
            <Input id="TipAmount" name="TipAmount" label="Enter Tip Amount" />
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
        <OrderCheckout
          list={list}
          totalBillAmount={totalBillAmount}
          totalPaidAmount={totalPaid}
          cashOutAmount={cashoutAmount}
          onClose={onClose}
        />
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
