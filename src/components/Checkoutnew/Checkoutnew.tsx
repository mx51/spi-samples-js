/* eslint no-else-return: "error" */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SuccessState, PurchaseResponse, Logger, TransactionType } from '@assemblypayments/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import './Checkoutnew.css';
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

function CheckoutNew(props: {
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
  } = props;
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [promptCashout, setPromptCashout] = useState(false);
  const [showSigApproval, setShowSigApproval] = useState(false);
  const flowEl = useRef<HTMLDivElement>(null);
  const receiptEl = useRef<HTMLPreElement>(null);

  const [purchaseState, setPurchaseState] = useState({ Finished: false, Success: '', Response: '' });
  const handlePurchaseStatusChange = useCallback((event: any) => {
    setPurchaseState({ ...event.detail });
    const flowMsg = new Logger(flowEl.current);
    const receipt = new Logger(receiptEl.current);

    console.log('???', event.detail);
    console.log(totalPaid);
    if (event.detail.AwaitingSignatureCheck) {
      setShowSigApproval(true);
    }

    if (event.detail.Finished) {
      if (spi.CurrentTxFlowState.Type === TransactionType.GetLastTransaction) {
        transactionFlowService.handleGetLastTransaction(flowMsg, receipt, spi, spi.CurrentTxFlowState);
      } else {
        console.log(receipt);
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

  // const handleSigApproval = useCallback((event: any) => {
  //   setShowSigApproval({ ...event.detail });

  //   if (event.detail.AwaitingSignatureCheck) {
  //     setShowSigApproval(true);
  //   }
  // }, []);
  // useEffect(() => {
  //   document.addEventListener('TxFlowStateChanged', handleSigApproval);
  //   return function cleanup() {
  //     document.removeEventListener('TxFlowStateChanged', handleSigApproval);
  //   };
  // });

  const totalBillAmount = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const totalAmount = totalBillAmount;

  function handleMotoPay() {
    motoService.initiateMotoPurchase({ Info: () => {} }, spi, parseInt(totalAmount, 10) * 100, surchargeAmount, false);
    setTransactionStatus(true);
  }

  // eslint-disable-next-line no-shadow
  function handleCreditCardPay(tipAmount: number, cashoutAmount: number) {
    const flowMsg = new Logger(flowEl.current);
    purchaseService.initiatePurchase(
      flowMsg,
      spi._options,
      spi,
      parseInt(totalAmount, 10) * 100,
      tipAmount,
      cashoutAmount,
      surchargeAmount,
      promptCashout
    );
    setTransactionStatus(true);
  }

  function handleRefundPay(refundAmount: number) {
    const flowMsg = new Logger(flowEl.current);
    refundService.initiateRefund(flowMsg, spi, refundAmount * 100, false);
    setTransactionStatus(true);
  }

  // eslint-disable-next-line no-shadow
  function handleCashoutPay(cashoutAmount: number) {
    const flowMsg = new Logger(flowEl.current);

    cashoutService.initiateCashout(flowMsg, console, spi, cashoutAmount * 100, surchargeAmount);
    setTransactionStatus(true);
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
      />
    );
  }

  function transactionSuccessful() {
    return (
      <div>
        {!purchaseState.Finished && (
          <div className="transaction-successful">
            <p>Processing Transaction</p>
            <button
              type="button"
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
            <button type="button" onClick={() => handleBack()}>
              Sorry!! Try Again
            </button>
          </div>
        )}
        {purchaseState.Finished && SuccessState.Success === purchaseState.Success && (
          <div className="transaction-successful">
            <Tick className="color-purple" />
            <div className="transaction-successful-button">
              <p>Transaction successful!</p>
              <button type="button" onClick={() => handleBack()}>
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
              <div ref={flowEl} />
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

export default CheckoutNew;
