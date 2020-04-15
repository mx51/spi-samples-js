/* eslint no-else-return: "error" */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SuccessState, PurchaseResponse, Logger, TransactionType } from '@mx51/spi-client-js';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import './Checkout.scss';
import Tick from '../Tick';
import OrderPay from '../OrderPay';
import RefundPay from '../RefundPay';
import CashOutPay from '../CashOutPay';
import PosUtils from '../../services/_common/pos';
import SigApproval from '../SigApproval';
import {
  purchase as purchaseService,
  moto as motoService,
  transactionFlow as transactionFlowService,
  refund as refundService,
  cashout as cashoutService,
} from '../../services';

function handlePurchaseStatusCallback(
  setStateChange: Function,
  event: any,
  flowEl: any,
  receiptEl: any,
  setShowSigApproval: Function,
  setShowUnknownModal: Function,
  spi: any,
  transactionAction: String
) {
  setStateChange({ ...event.detail });

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
      spi.AckFlowEndedAndBackToIdle();
    } else {
      PosUtils.processCompletedEvent(
        flowMsg,
        receipt,
        transactionAction === 'purchase' ? purchaseService : refundService,
        event.detail
      );
    }
  } else {
    transactionFlowService.handleTransaction(flowMsg, event.detail);
  }
}

function displayReceipt(txState: any) {
  const { Response, SignatureRequiredMessage, Type } = txState;

  if (Response && Type !== 'GetLastTransaction') {
    return new PurchaseResponse(Response).GetCustomerReceipt().trim();
  } else if (!Response && SignatureRequiredMessage && SignatureRequiredMessage.GetMerchantReceipt) {
    return SignatureRequiredMessage.GetMerchantReceipt().trim();
  }
  return undefined;
}

function motoPay(
  spi: any,
  totalAmount: number,
  surchargeAmount: number,
  amount: number,
  suppressMerchantPassword: boolean,
  setTransactionStatus: Function,
  setFinalCashout: Function,
  setFinalTipAmount: Function,
  setFinalSurcharge: Function,
  setPurchaseAmount: Function,
  setFinalTotal: Function
) {
  motoService.initiateMotoPurchase(
    { Info: () => {} },
    spi,
    totalAmount * 100,
    surchargeAmount,
    suppressMerchantPassword
  );
  setTransactionStatus(true);
  setFinalTipAmount(0);
  setFinalSurcharge(surchargeAmount / 100);
  setFinalCashout(0);
  setPurchaseAmount(amount);
  setFinalTotal(totalAmount);
}

function creditCardPay(
  tipAmount: number,
  cashoutAmount: number,
  manualAmount: number,
  openPricing: boolean,
  flowEl: any,
  spi: any,
  amount: number,
  surchargeAmount: number,
  promptCashout: boolean,
  setTransactionStatus: Function,
  setFinalCashout: Function,
  setFinalTipAmount: Function,
  setFinalSurcharge: Function,
  setPurchaseAmount: Function,
  setFinalTotal: Function
) {
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
function refundPay(
  refundAmount: number,
  flowEl: any,
  spi: any,
  suppressMerchantPassword: boolean,
  setTransactionStatus: Function,
  setFinalCashout: Function,
  setFinalTipAmount: Function,
  setFinalSurcharge: Function,
  setPurchaseAmount: Function,
  setFinalTotal: Function
) {
  const flowMsg = new Logger(flowEl.current);
  refundService.initiateRefund(flowMsg, spi, refundAmount * 100, suppressMerchantPassword);
  setTransactionStatus(true);
  setFinalTotal(refundAmount);
  setPurchaseAmount(0);
  setFinalTipAmount(0);
  setFinalSurcharge(0);
  setFinalCashout(0);
}

function cashoutPay(
  cashoutAmount: number,
  flowEl: any,
  spi: any,
  surchargeAmount: number,
  setTransactionStatus: Function,
  setFinalCashout: Function,
  setFinalTipAmount: Function,
  setFinalSurcharge: Function,
  setPurchaseAmount: Function,
  setFinalTotal: Function
) {
  const flowMsg = new Logger(flowEl.current);

  cashoutService.initiateCashout(flowMsg, console, spi, cashoutAmount * 100, surchargeAmount);
  setTransactionStatus(true);
  setFinalCashout(cashoutAmount);
  setFinalSurcharge(surchargeAmount);
  setFinalTotal(cashoutAmount + surchargeAmount / 100);
  setPurchaseAmount(0);
  setFinalTipAmount(0);
}

function backAction(
  stateChange: any,
  onNoThanks: Function,
  setSurchargeAmount: Function,
  setStateChange: Function,
  setTransactionStatus: Function,
  flowEl: React.RefObject<HTMLDivElement>,
  receiptEl: React.RefObject<HTMLPreElement>,
  onClose: Function
) {
  if (stateChange.Finished) {
    onNoThanks();
    setSurchargeAmount(0);
  }
  setStateChange({ Finished: false, Success: SuccessState.Unknown });
  setTransactionStatus(false);
  if (flowEl.current !== null) {
    // eslint-disable-next-line no-param-reassign
    flowEl.current.innerHTML = '';
  }
  if (receiptEl.current !== null) {
    // eslint-disable-next-line no-param-reassign
    receiptEl.current.innerHTML = '';
  }

  onClose();
}

function Checkout(props: {
  visible: Boolean;
  list: any;
  onClose: Function;
  onNoThanks: Function;
  spi: any;
  surchargeAmount: number;
  setSurchargeAmount: Function;
  setTransactionStatus: any;
  transactionStatus: boolean;
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
  const [promptCashout, setPromptCashout] = useState(false);
  const [showSigApproval, setShowSigApproval] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalSurcharge, setFinalSurcharge] = useState(0);
  const [finalCashout, setFinalCashout] = useState(0);
  const [finalTipAmount, setFinalTipAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const flowEl = useRef<HTMLDivElement>(null);
  const receiptEl = useRef<HTMLPreElement>(null);

  const [stateChange, setStateChange] = useState({
    Finished: false,
    Success: SuccessState.Unknown,
  } as any);

  const handlePurchaseStatusChange = useCallback((event: any) => {
    handlePurchaseStatusCallback(
      setStateChange,
      event,
      flowEl,
      receiptEl,
      setShowSigApproval,
      setShowUnknownModal,
      spi,
      transactionAction
    );
  }, []); // eslint-disable-line
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
  }, [transactionAction]); // eslint-disable-line

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const totalAmount = parseInt(totalBillAmount, 10) + surchargeAmount / 100;
  const amount = parseInt(totalBillAmount, 10);

  function handleMotoPay() {
    motoPay(
      spi,
      totalAmount,
      surchargeAmount,
      amount,
      suppressMerchantPassword,
      setTransactionStatus,
      setFinalCashout,
      setFinalTipAmount,
      setFinalSurcharge,
      setPurchaseAmount,
      setFinalTotal
    );
  }

  function handleCreditCardPay(tipAmount: number, cashoutAmount: number, manualAmount: number) {
    creditCardPay(
      tipAmount,
      cashoutAmount,
      manualAmount,
      openPricing,
      flowEl,
      spi,
      amount,
      surchargeAmount,
      promptCashout,
      setTransactionStatus,
      setFinalCashout,
      setFinalTipAmount,
      setFinalSurcharge,
      setPurchaseAmount,
      setFinalTotal
    );
  }

  function handleRefundPay(refundAmount: number) {
    refundPay(
      refundAmount,
      flowEl,
      spi,
      suppressMerchantPassword,
      setTransactionStatus,
      setFinalCashout,
      setFinalTipAmount,
      setFinalSurcharge,
      setPurchaseAmount,
      setFinalTotal
    );
  }

  function handleCashoutPay(cashoutAmount: number) {
    cashoutPay(
      cashoutAmount,
      flowEl,
      spi,
      surchargeAmount,
      setTransactionStatus,
      setFinalCashout,
      setFinalTipAmount,
      setFinalSurcharge,
      setPurchaseAmount,
      setFinalTotal
    );
  }

  function handleBack() {
    backAction(
      stateChange,
      onNoThanks,
      setSurchargeAmount,
      setStateChange,
      setTransactionStatus,
      flowEl,
      receiptEl,
      onClose
    );
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
        transactionStatus={transactionStatus}
      />
    );
  }

  function transactionSuccessful() {
    return (
      <div>
        {!stateChange.Finished && (
          <div className="transaction-successful">
            <h6>Purchase: ${purchaseAmount}</h6>
            <h6>Tip amount: ${finalTipAmount}</h6>
            <h6>Cashout: ${finalCashout}</h6>
            <h6>Surcharge: ${finalSurcharge}</h6>
            {transactionAction === 'refund' ? (
              <p>Total Refund amount: ${finalTotal}</p>
            ) : (
              <p>Total amount: ${finalTotal}</p>
            )}
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
        {stateChange.Finished && SuccessState.Failed === stateChange.Success && (
          <div className="transaction-successful">
            <p>
              {stateChange.Response && stateChange.Response.GetErrorDetail && transactionAction === 'refund'
                ? stateChange.Response.GetErrorDetail()
                : new PurchaseResponse(stateChange.Response).GetResponseText()}
            </p>
            <button type="button" className="primary-button" onClick={() => handleBack()}>
              Back
            </button>
          </div>
        )}
        {stateChange.Finished && SuccessState.Success === stateChange.Success && (
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
          <Modal.Title>Unable to verify transaction status.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please confirm the transaction status on the EFTPOS terminal.</p>
          <p>Does it show the transaction was successful? </p>
          <Button
            variant="primary"
            className="btn-custom unknownStatusButton"
            onClick={() => {
              handleOverrideTransaction();
              handleBack();
            }}
          >
            Yes
          </Button>
          <Button
            variant="primary"
            className="btn-custom"
            onClick={() => {
              handleOverrideTransaction();
              handleBack();
            }}
          >
            No
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
            onClick={() => {
              handleBack();
            }}
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
                {displayReceipt(stateChange)}
              </pre>
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default Checkout;
