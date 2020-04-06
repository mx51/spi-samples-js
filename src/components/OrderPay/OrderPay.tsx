import React, { useState, SyntheticEvent } from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from '../Input/Input';
import Checkbox from '../Checkbox/Checkbox';

enum PaymentType {
  Moto,
  CreditCard,
}

function OrderPay(props: {
  handleMotoPay: Function;
  handleCreditCardPay: Function;
  totalAmount: number;
  promptCashout: boolean;
  setPromptCashout: Function;
  openPricing: boolean;
  setOpenPricing: Function;
  transactionStatus: boolean;
}) {
  const {
    handleMotoPay,
    handleCreditCardPay,
    totalAmount,
    promptCashout,
    setPromptCashout,
    openPricing,
    setOpenPricing,
    transactionStatus,
  } = props;
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCard);

  function CreditCard() {
    const [tipAmount, setTipAmount] = useState(0);
    const [cashoutAmount, setCashoutAmount] = useState(0);
    const [manualAmount, setManualAmount] = useState<number>(0);

    function handleKeyPress(event: any) {
      if (event.key < '0' || event.key > '9') {
        alert('invalid input');
        event.preventDefault();
        return false;
      }
      setPromptCashout(false);
      return true;
    }
    return (
      <>
        <div className="ml-4 mr-4">
          <Input
            id="inpTipAmount"
            name="Tip"
            label="Tip Amount"
            disabled={cashoutAmount > 0 || transactionStatus}
            min="0"
            type="number"
            onKeyPress={handleKeyPress}
            onChange={(e: any) => setTipAmount(parseInt(e.target.value, 10))}
          />
          <p className="ml-2">Cents</p>
          <Input
            id="inpCashoutAmount"
            name="Cashout amount"
            label="cashout Amount"
            disabled={tipAmount > 0 || transactionStatus}
            min="0"
            onKeyPress={handleKeyPress}
            type="number"
            onChange={(e: any) => setCashoutAmount(parseInt(e.target.value, 10))}
          />
          <p className="ml-2">Cents</p>
          <Checkbox
            type="checkbox"
            id="prompt_cashout"
            disabled={tipAmount > 0 || transactionStatus}
            checked={promptCashout}
            label="Prompt for Cashout"
            onChange={(e: any) => setPromptCashout(e.currentTarget.checked)}
          />
          <hr />
          <hr />
          <Input
            id="inpOpenPrice"
            name="Open Price"
            label="Order Amount"
            disabled={openPricing === false || transactionStatus}
            min="0"
            defaultValue={manualAmount === 0 ? '' : manualAmount.toString()}
            type="number"
            onChange={(e: any) => setManualAmount(parseInt(e.target.value, 10))}
          />
          <p className="ml-2">Cents</p>
          <Checkbox
            type="checkbox"
            id="open-pricing"
            label="Override Order Total"
            disabled={transactionStatus}
            checked={openPricing}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => {
              if (e && e.currentTarget) {
                setOpenPricing(e.currentTarget.checked);
              }
            }}
          />
        </div>
        <button
          id="creditCardPay"
          className="primary-button checkout-button mb-0 pull-left"
          type="button"
          disabled={transactionStatus}
          onClick={() => {
            handleCreditCardPay(tipAmount, cashoutAmount, manualAmount);
            window.localStorage.setItem('open_pricing', openPricing.toString());
          }}
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
        <button
          id="motoPay"
          className="primary-button checkout-button mb-0"
          type="button"
          disabled={transactionStatus}
          onClick={() => handleMotoPay()}
        >
          MOTO
        </button>
      </>
    );
  }

  function showPaymentType() {
    switch (paymentType) {
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
      <h2 id="totalAmount" className="sub-header mb-0">
        Order total ${totalAmount}
      </h2>
      <Row className="order-header-buttons no-gutters">
        <Col sm={6}>
          <button id="moto" type="button" disabled={transactionStatus} onClick={() => setPaymentType(PaymentType.Moto)}>
            Moto
          </button>
        </Col>
        <Col sm={6}>
          <button type="button" disabled={transactionStatus} onClick={() => setPaymentType(PaymentType.CreditCard)}>
            Credit card
          </button>
        </Col>
      </Row>
      {showPaymentType()}
    </>
  );
}

export default OrderPay;
