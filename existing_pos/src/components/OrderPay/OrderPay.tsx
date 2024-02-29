import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SpiStatus } from '@mx51/spi-client-js';
import CreditCard from '../CreditCardPay';
import Moto from '../MotoPay';

enum PaymentType {
  MotoType,
  CreditCardType,
}

function payAction(
  status: String,
  onErrorMsg: Function,
  showPaymentType: Function,
  paymentType: PaymentType,
  handleMotoPay: Function,
  handleCreditCardPay: Function,
  tipAmount: number,
  cashoutAmount: number,
  manualAmount: number
) {
  if (status !== SpiStatus.PairedConnected) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else if (paymentType === PaymentType.MotoType) {
    showPaymentType();
    handleMotoPay();
  } else {
    showPaymentType();
    handleCreditCardPay(tipAmount, cashoutAmount, manualAmount);
  }
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
  status: string;
  onErrorMsg: Function;
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
    status,
    onErrorMsg,
  } = props;
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CreditCardType);

  function showPaymentType() {
    switch (paymentType) {
      case PaymentType.MotoType:
        return (
          <Moto
            transactionStatus={transactionStatus}
            payActionType={(tipAmount: number, cashoutAmount: number, manualAmount: number) =>
              payAction(
                status,
                onErrorMsg,
                showPaymentType,
                paymentType,
                handleMotoPay,
                handleCreditCardPay,
                tipAmount,
                cashoutAmount,
                manualAmount
              )
            }
          />
        );
      case PaymentType.CreditCardType:
        return (
          <CreditCard
            setPromptCashout={setPromptCashout}
            promptCashout={promptCashout}
            transactionStatus={transactionStatus}
            openPricing={openPricing}
            setOpenPricing={setOpenPricing}
            payActionType={(tipAmount: number, cashoutAmount: number, manualAmount: number) =>
              payAction(
                status,
                onErrorMsg,
                showPaymentType,
                paymentType,
                handleMotoPay,
                handleCreditCardPay,
                tipAmount,
                cashoutAmount,
                manualAmount
              )
            }
          />
        );
      default:
        return (
          <CreditCard
            setPromptCashout={setPromptCashout}
            promptCashout={promptCashout}
            transactionStatus={transactionStatus}
            openPricing={openPricing}
            setOpenPricing={setOpenPricing}
            payActionType={(tipAmount: number, cashoutAmount: number, manualAmount: number) =>
              payAction(
                status,
                onErrorMsg,
                showPaymentType,
                paymentType,
                handleMotoPay,
                handleCreditCardPay,
                tipAmount,
                cashoutAmount,
                manualAmount
              )
            }
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
            onClick={() => {
              setPaymentType(PaymentType.CreditCardType);
            }}
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
