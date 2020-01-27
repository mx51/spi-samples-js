import React, { useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import Input from '../Input/Input';

enum PaymentType {
  // Cash,
  Moto,
  CreditCard,
}

function OrderPay(props: {
  handleMotoPay: Function;
  handleCreditCardPay: Function;
  totalAmount: string;
  promptCashout: boolean;
  setPromptCashout: Function;
}) {
  const { handleMotoPay, handleCreditCardPay, totalAmount, promptCashout, setPromptCashout } = props;
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCard);

  function CreditCard() {
    const [tipAmount, setTipAmount] = useState(0);
    const [cashoutAmount, setCashoutAmount] = useState(0);

    function handleKeyPress(event: any) {
      if (event.key < '0' || event.key > '9') {
        alert('invalid input');
        event.preventDefault();
        return false;
      }
      return true;
    }

    return (
      <>
        <div className="ml-4 mr-4">
          <Input
            id="Tip"
            name="Tip"
            label="Tip Amount"
            disabled={cashoutAmount > 0}
            min="0"
            type="number"
            onKeyPress={handleKeyPress}
            onChange={(e: any) => setTipAmount(parseInt(e.target.value, 10))}
          />
          <p className="ml-2">Cents</p>
          <Input
            id="cashout-amount"
            name="Cashout amount"
            label="cashout Amount"
            disabled={tipAmount > 0}
            min="0"
            onKeyPress={handleKeyPress}
            type="number"
            onChange={(e: any) => setCashoutAmount(parseInt(e.target.value, 10))}
          />
          <p className="ml-2">Cents</p>
        </div>
        <Form.Check
          type="checkbox"
          id="prompt_cashout"
          className="m-2"
          checked={promptCashout}
          label="Prompt for Cashout"
          onChange={(e: any) => setPromptCashout(e.currentTarget.checked)}
        />
        <button
          className="primary-button checkout-button mb-0 pull-left"
          type="button"
          onClick={() => handleCreditCardPay(tipAmount, cashoutAmount)}
        >
          Pay
        </button>
      </>
    );
  }
  function Moto() {
    return (
      <>
        <div className="ml-4 mr-4">
          <p>
            Please click process as Moto button{' '}
            <span role="img" aria-label="down arrow">
              👇
            </span>{' '}
            to process your payment
          </p>
        </div>
        <button className="primary-button checkout-button mb-0" type="button" onClick={() => handleMotoPay()}>
          MOTO
        </button>
      </>
    );
  }

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
    <>
      <h2 className="sub-header mb-0">Order total ${parseInt(totalAmount, 10)}</h2>
      <Row className="order-header-buttons no-gutters">
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
      {showPaymentType()}
    </>
  );
}

export default OrderPay;
