function getLocalStorage(name: string): Any {
  return window.localStorage.getItem(name);
}

function setLocalStorage(name: string, value: Any): Any {
  return window.localStorage.setItem(name, value);
}

function removeItemFromLocalStorage(name: string): Any {
  return window.localStorage.removeItem(name);
}

function getTxFlow(detail: Any) {
  const txFlowDetails = {
    posRefId: detail?.PosRefId,
    id: detail?.Id,
    type: detail?.Type,
    displayMessage: detail?.DisplayMessage,
    amountCents: detail?.AmountCents,
    awaitingSignatureCheck: detail?.AwaitingSignatureCheck,
    finished: detail?.Finished,
    success: detail?.Success,
    response: {
      data: {
        rrn: detail?.Response?.Data?.rrn,
        schemeAppName: detail?.Response?.Data?.scheme_app_name,
        schemeName: detail?.Response?.Data?.scheme_name,
        merchantReceipt: detail?.Response?.Data?.merchant_receipt,
        transactionType: detail?.Response?.Data?.transaction_Type,
        hostResponseText: detail?.Response?.Data?.host_response_text,
      },
    },
    signatureRequiredMessage: detail?.SignatureRequiredMessage,
    request: {
      id: detail?.Request.Id,
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
  };
  return txFlowDetails;
}

export { getLocalStorage, setLocalStorage, removeItemFromLocalStorage, getTxFlow };
