import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CreditCard from '../CreditCardPay';
import Moto from '../MotoPay';

enum PaymentType {
  MotoType,
  CreditCardType,
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
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCardType);

  function showPaymentType() {
    switch (paymentType) {
      case PaymentType.MotoType:
        return <Moto handleMotoPay={handleMotoPay} transactionStatus={transactionStatus} />;
      case PaymentType.CreditCardType:
        return (
          <CreditCard
            setPromptCashout={setPromptCashout}
            promptCashout={promptCashout}
            transactionStatus={transactionStatus}
            handleCreditCardPay={handleCreditCardPay}
            openPricing={openPricing}
            setOpenPricing={setOpenPricing}
          />
        );
      default:
        return (
          <CreditCard
            setPromptCashout={setPromptCashout}
            promptCashout={promptCashout}
            transactionStatus={transactionStatus}
            handleCreditCardPay={handleCreditCardPay}
            openPricing={openPricing}
            setOpenPricing={setOpenPricing}
          />
        );
    }
  }
  return (
    <>
      <h2 id="totalAmount" className="sub-header mb-0">
        Order total ${totalAmount}
      </h2>
      <Row className="order-header-buttons no-gutters">
        <Col sm={6}>
          <button
            className="btn btn-outline-primary rounded-0 btn-block btn-lg mb-2"
            id="moto"
            type="button"
            disabled={transactionStatus}
            onClick={() => setPaymentType(PaymentType.MotoType)}
          >
            Moto
          </button>
        </Col>
        <Col sm={6}>
          <button
            className="btn btn-outline-primary rounded-0 btn-block btn-lg mb-2"
            type="button"
            disabled={transactionStatus}
            onClick={() => setPaymentType(PaymentType.CreditCardType)}
          >
            Credit card
          </button>
        </Col>
      </Row>
      {showPaymentType()}
    </>
  );
}

export default OrderPay;
