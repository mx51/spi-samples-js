/* eslint no-else-return: "error" */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SuccessState, PurchaseResponse, Logger, TransactionType } from '@mx51/spi-client-js';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import './Checkout.scss';
import Tick from '../Tick';
import OrderPay from '../OrderPay/OrderPay';
import RefundPay from '../RefundPay/RefundPay';
import CashOutPay from '../CashOutPay/CashOutPay';
import PosUtils from '../../services/_common/pos';
import SigApproval from '../SigApproval/SigApproval';
import {
  purchase as purchaseService,
  moto as motoService,
  transactionFlow as transactionFlowService,
  refund as refundService,
  cashout as cashoutService,
} from '../../services';

function Checkout(props: {
  visible: Boolean;
  list: any;
  onClose: Function;
  onNoThanks: Function;
  spi: any;
  surchargeAmount: number;
  setSurchargeAmount: Function;
  setTransactionStatus: any;
  transactionStatus: any;
  transactionAction: string;
  showUnknownModal: boolean;
  setShowUnknownModal: Function;
  handleOverrideTransaction: Function;
  suppressMerchantPassword: boolean;
  openPricing: boolean;
  setOpenPricing: Function;
}) {
  const {
    onClose,
    visible,
    onNoThanks,
    spi,
    list,
    surchargeAmount,
    setSurchargeAmount,
    setTransactionStatus,
    transactionStatus,
    transactionAction,
    showUnknownModal,
    setShowUnknownModal,
    handleOverrideTransaction,
    suppressMerchantPassword,
    openPricing,
    setOpenPricing,
  } = props;
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [promptCashout, setPromptCashout] = useState(false);
  const [showSigApproval, setShowSigApproval] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalSurcharge, setFinalSurcharge] = useState(0);
  const [finalCashout, setFinalCashout] = useState(0);
  const [finalTipAmount, setFinalTipAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [finalRefund, setFinalRefund] = useState(0);
  // const [showUnknownModal, setShowUnknownModal] = useState(false);
  const flowEl = useRef<HTMLDivElement>(null);
  const receiptEl = useRef<HTMLPreElement>(null);

  const [purchaseState, setPurchaseState] = useState({ Finished: false, Success: '', Response: '' });

  // function handleOverrideTransaction() {
  //   spi.AckFlowEndedAndBackToIdle();
  //   setShowUnknownModal(false);
  // }

  const handlePurchaseStatusChange = useCallback((event: any) => {
    setPurchaseState({ ...event.detail });
    console.log(totalPaid);
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    if (event.detail.AwaitingSignatureCheck) {
      setShowSigApproval(true);
    }
    if (event.detail.Finished && event.detail.Success === SuccessState.Unknown) {
      setShowUnknownModal(true);
    }

    if (event.detail.Finished) {
      if (spi.CurrentTxFlowState.Type === TransactionType.GetLastTransaction) {
        transactionFlowService.handleGetLastTransaction(flowMsg, receipt, spi, spi.CurrentTxFlowState);
      } else {
        PosUtils.processCompletedEvent(flowMsg, receipt, purchaseService, event.detail);
      }
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

  useEffect(() => {
    if (transactionAction === 'lastTransaction') {
      const flowMsg = new Logger(flowEl.current);
      transactionFlowService.initiateGetLastTransaction(flowMsg, spi);
    }
  }, [transactionAction]);

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const totalAmount = parseInt(totalBillAmount, 10) + surchargeAmount / 100;
  const amount = parseInt(totalBillAmount, 10);

  function handleMotoPay() {
    motoService.initiateMotoPurchase(
      { Info: () => {} },
      spi,
      totalAmount * 100,
      surchargeAmount,
      suppressMerchantPassword
    );
    setTransactionStatus(true);
  }

  function handleCreditCardPay(tipAmount: number, cashoutAmount: number, manualAmount: number) {
    if (openPricing === true && manualAmount > 0) {
      const flowMsg = new Logger(flowEl.current);
      purchaseService.initiatePurchase(
        flowMsg,
        spi._options,
        spi,
        manualAmount,
        tipAmount,
        cashoutAmount,
        surchargeAmount,
        promptCashout
      );
      const total = (tipAmount + cashoutAmount + surchargeAmount) / 100 + manualAmount / 100;
      setTransactionStatus(true);
      setFinalTotal(total);
      setFinalTipAmount(tipAmount / 100);
      setFinalSurcharge(surchargeAmount / 100);
      setFinalCashout(cashoutAmount / 100);
      setFinalRefund(0);
      setPurchaseAmount(manualAmount / 100);
    } else {
      const flowMsg = new Logger(flowEl.current);
      purchaseService.initiatePurchase(
        flowMsg,
        spi._options,
        spi,
        amount * 100,
        tipAmount,
        cashoutAmount,
        surchargeAmount,
        promptCashout
      );
      setTransactionStatus(true);
      const total = (tipAmount + cashoutAmount + surchargeAmount) / 100 + amount;
      setFinalTotal(total);
      setFinalTipAmount(tipAmount / 100);
      setFinalSurcharge(surchargeAmount / 100);
      setFinalCashout(cashoutAmount / 100);
      setPurchaseAmount(amount);
    }
  }

  function handleRefundPay(refundAmount: number) {
    const flowMsg = new Logger(flowEl.current);
    refundService.initiateRefund(flowMsg, spi, refundAmount * 100, suppressMerchantPassword);
    setTransactionStatus(true);
    setFinalRefund(refundAmount);
    setFinalTotal(refundAmount);
    setPurchaseAmount(0);
    setFinalTipAmount(0);
    setFinalSurcharge(0);
    setFinalCashout(0);
  }

  function handleCashoutPay(cashoutAmount: number) {
    const flowMsg = new Logger(flowEl.current);

    cashoutService.initiateCashout(flowMsg, console, spi, cashoutAmount * 100, surchargeAmount);
    setTransactionStatus(true);
    setFinalCashout(cashoutAmount);
    setFinalSurcharge(surchargeAmount);
    setFinalTotal(cashoutAmount + surchargeAmount / 100);
    setPurchaseAmount(0);
    setFinalRefund(0);
    setFinalTipAmount(0);
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
    if (transactionAction === 'refund') {
      return <RefundPay handleRefundPay={handleRefundPay} />;
    } else if (transactionAction === '' && list.length === 0) {
      return <CashOutPay handleCashoutPay={handleCashoutPay} />;
    }
    return (
      <OrderPay
        handleCreditCardPay={handleCreditCardPay}
        handleMotoPay={handleMotoPay}
        totalAmount={totalAmount}
        promptCashout={promptCashout}
        setPromptCashout={setPromptCashout}
        openPricing={openPricing}
        setOpenPricing={setOpenPricing}
      />
    );
  }

  function transactionSuccessful() {
    return (
      <div>
        {!purchaseState.Finished && (
          <div className="transaction-successful">
            <h6>Purchase: ${purchaseAmount}</h6>
            <h6>Tip amount: ${finalTipAmount}</h6>
            <h6>Cashout: ${finalCashout}</h6>
            <h6>Refund: ${finalRefund}</h6>
            <h6>Surcharge: ${finalSurcharge}</h6>
            <p>Total amount: ${finalTotal}</p>
            <p>Processing Transaction</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                transactionFlowService.cancelTransaction(spi);
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Failed === purchaseState.Success && (
          <div className="transaction-successful">
            <p>{new PurchaseResponse(purchaseState.Response).GetResponseText()}</p>
            <button type="button" className="primary-button" onClick={() => handleBack()}>
              Back
            </button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Success === purchaseState.Success && (
          <div className="transaction-successful">
            <Tick className="color-purple" />
            <div className="transaction-successful-button">
              <p>Transaction successful!</p>
              <button type="button" className="primary-button" onClick={() => handleBack()}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`checkout-page1 ${visible ? '' : 'd-none'}`}>
      <SigApproval
        show={showSigApproval}
        handleClose={() => {
          setShowSigApproval(false);
        }}
        setShowSigApproval={setShowSigApproval}
        spi={spi}
      />
      <Modal show={showUnknownModal} onHide={() => setShowUnknownModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Let the POS know that customer actually paid?</p>
          <Button
            variant="primary"
            className="btn-custom unknownStatusButton"
            onClick={() => {
              handleOverrideTransaction();
              handleBack();
            }}
          >
            Paid
          </Button>
          <Button
            variant="primary"
            className="btn-custom"
            onClick={() => {
              handleOverrideTransaction();
              handleBack();
            }}
          >
            Fail
          </Button>
        </Modal.Body>
      </Modal>
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
            ▼
          </button>
          <Row style={transactionAction !== 'lastTransaction' ? {} : { flexDirection: 'row-reverse' }}>
            {transactionAction !== 'lastTransaction' && (
              <Col sm={4} className="sub-column">
                {showRelatedPay()}
              </Col>
            )}
            <Col sm={transactionAction !== 'lastTransaction' ? 5 : 9} className="sub-column">
              <h2 className="sub-header mb-0">Flow</h2>
              <div className="flow-alignment" ref={flowEl} />
              {!transactionStatus ? '' : transactionSuccessful()}
            </Col>
            <Col sm={3} className="sub-column">
              <h2 className="sub-header mb-0">
                {transactionAction !== 'lastTransaction' ? 'Receipt' : 'Last Transaction'}
              </h2>
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

export default Checkout;
