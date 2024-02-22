import { TransactionType } from '@mx51/spi-client-js';
import { PATH_ORDER_FINISHED, PATH_PAIR } from '../../../definitions/constants/routerConfigs';
import { getAmountCentsByTxType, getTxTypeByPosRefId } from '../../tx-utils';

function getLocalStorage(name: string): Any {
  return window.localStorage.getItem(name);
}

function setLocalStorage(name: string, value: Any): Any {
  return window.localStorage.setItem(name, value);
}

function removeItemFromLocalStorage(name: string): Any {
  return window.localStorage.removeItem(name);
}

function isShownTerminalDetails(pathname: string): boolean {
  const pathNameArray = pathname?.split('/');
  const currentTerminals = JSON.parse(getLocalStorage('terminals') || '{}');

  return !!currentTerminals[pathNameArray[pathNameArray.length - 1]];
}

function showDeveloperMode(pathname: string): boolean {
  return pathname === PATH_PAIR || pathname === PATH_ORDER_FINISHED || isShownTerminalDetails(pathname);
}

function mapGetTxToActualTxType(txFlowDetails: Any): Any {
  const type = getTxTypeByPosRefId(txFlowDetails.posRefId, false);
  return {
    ...txFlowDetails,
    type,
    isGetTx: [TransactionType.GetTransaction].includes(txFlowDetails.type),
    amountCents: getAmountCentsByTxType(type, txFlowDetails.response),
  };
}

function getTxFlow(detail: Any): Any {
  const txFlowDetails = {
    posRefId: detail?.PosRefId,
    id: detail?.Id,
    type: detail?.Type,
    displayMessage: detail?.DisplayMessage,
    amountCents: detail?.AmountCents,
    awaitingSignatureCheck: detail?.AwaitingSignatureCheck,
    finished: detail?.Finished,
    success: detail?.Success,
    signatureRequiredMessage: detail?.SignatureRequiredMessage,
    completedTime: detail?.CompletedTime,
    cancelAttemptTime: detail?.CancelAttemptTime,
    receipt: detail?.Response?.Data?.merchant_receipt,
    request: {
      id: detail?.Request?.Id,
      eventName: detail?.Request?.EventName,
      data: {
        posRefId: detail?.Request?.Data?.pos_ref_id,
        purchaseAmount: detail?.Request?.Data?.purchase_amount,
        tipAmount: detail?.Request?.Data?.tip_amount,
        refundAmount: detail?.Request?.Data?.refund_amount,
        // We check cash_amount here as that is what we get from the event (instead of bank_cash_amount)
        bankCashAmount: detail?.Request?.Data?.cash_amount,
        promptForCashout: detail?.Request?.Data?.prompt_for_cashout,
        surchargeAmount: detail?.Request?.Data?.surcharge_amount,
        preAuthAmount: detail?.Request?.Data?.preauth_amount,
        topupAmount: detail?.Request?.Data?.topup_amount,
        reduceAmount: detail?.Request?.Data?.preauth_cancel_amount,
        promptForCustomerCopy: false,
        printForSignatureRequiredTransactions: false,
        printMerchantCopy: false,
        customerReceiptHeader: '',
        customerReceiptFooter: '',
        merchantReceiptHeader: '',
        merchantReceiptFooter: '',
      },
      posId: '',
      decryptedJson: '',
    },
    response: {
      data: {
        rrn: detail?.Response?.Data?.rrn,
        schemeAppName: detail?.Response?.Data?.scheme_app_name,
        schemeName: detail?.Response?.Data?.scheme_name,
        merchantReceipt: detail?.Response?.Data?.merchant_receipt,
        transactionType: detail?.Response?.Data?.transaction_type,
        hostResponseText: detail?.Response?.Data?.host_response_text,
        hostResponseCode: detail?.Response?.Data?.host_response_code,
        purchaseAmount: detail?.Response?.Data?.purchase_amount || 0,
        surchargeAmount: detail?.Response?.Data?.surcharge_amount || 0,
        bankCashAmount: detail?.Response?.Data?.bank_cash_amount || 0,
        tipAmount: detail?.Response?.Data?.tip_amount || 0,
        preAuthAmount: detail?.Response?.Data?.preauth_amount || 0,
        topupAmount: detail?.Response?.Data?.topup_amount || 0,
        reduceAmount: detail?.Response?.Data?.preauth_cancel_amount || 0,
        completionAmount: detail?.Response?.Data?.completion_amount || 0,
        preAuthId: detail?.Response?.Data?.preauth_id,
        refundAmount: detail?.Response?.Data?.refund_amount || 0,
        balanceAmount: detail?.Response?.Data?.balance_amount || 0,
      },
    },
  };

  return txFlowDetails.request.eventName === 'get_transaction' ? mapGetTxToActualTxType(txFlowDetails) : txFlowDetails;
}

export {
  getLocalStorage,
  getTxFlow,
  isShownTerminalDetails,
  removeItemFromLocalStorage,
  setLocalStorage,
  showDeveloperMode,
};
