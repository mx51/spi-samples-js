import { PATH_PAIR } from '../../../definitions/constants/routerConfigs';

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
  return pathname === PATH_PAIR || isShownTerminalDetails(pathname);
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
    request: {
      id: detail?.Request?.Id,
      eventName: detail?.Request?.EventName,
      data: {
        posRefId: detail?.Request?.Data?.pos_ref_id,
        purchaseAmount: detail?.Request?.Data?.purchase_amount,
        tipAmount: detail?.Request?.Data?.tip_amount,
        cashAmount: detail?.Request?.Data?.cash_amount,
        promptForCashout: detail?.Request?.Data?.prompt_for_cashout,
        surchargeAmount: detail?.Request?.Data?.surcharge_amount,
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
        purchaseAmount: detail?.Response?.Data?.purchase_amount || 0,
        surchargeAmount: detail?.Response?.Data?.surcharge_amount || 0,
        cashAmount: detail?.Response?.Data?.cash_amount || 0,
        tipAmount: detail?.Response?.Data?.tip_amount || 0,
      },
    },
  };
  return txFlowDetails;
}

export {
  getLocalStorage,
  getTxFlow,
  isShownTerminalDetails,
  removeItemFromLocalStorage,
  setLocalStorage,
  showDeveloperMode,
};
