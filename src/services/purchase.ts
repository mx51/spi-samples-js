import { PurchaseResponse } from '@mx51/spi-client-js';

// Initiate a transaction
function initiatePurchase(
  flowMsg: Logger,
  options: Options,
  spi: Spi,
  purchaseAmount: number,
  tipAmount: number,
  cashoutAmount: number,
  surchargeAmount: number,
  promptForCashout: boolean
) {
  const posRefId = `purchase-${new Date().toISOString()}`;
  const res = spi.InitiatePurchaseTxV2(
    posRefId,
    purchaseAmount,
    tipAmount,
    cashoutAmount,
    promptForCashout,
    options,
    surchargeAmount
  );

  flowMsg.Info(
    res.Initiated
      ? '# Purchase Initiated. Will be updated with Progress.'
      : `# Could not initiate purchase: ${res.Message}. Please Retry.`
  );
}

function initiateZipPurchase(
  flowMsg: Logger,
  options: Options,
  spi: Spi,
  purchaseAmount: number,
  storeCode: string,
  description: string
) {
  const res = spi.InitiateZipPurchaseTx(
    `zprchs-${new Date().toISOString()}`,
    purchaseAmount,
    description,
    storeCode,
    options
  );

  if (res.Initiated) {
    flowMsg.Info('# Zip Purchase Initiated. Will be updated with Progress.');
  } else {
    flowMsg.Info(`# Could not initiate Zip purchase: ${res.Message}. Please Retry.`);
  }
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# WE DID NOT GET PAID :(`);

  if (txStateResponse != null) {
    const purchaseResponse = new PurchaseResponse(txStateResponse);
    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Error Detail: ${txStateResponse.GetErrorDetail()}`);
    flowMsg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
    flowMsg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
    flowMsg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
    flowMsg.Info(`# Customer Receipt:`);

    receipt.Info(
      !purchaseResponse.WasCustomerReceiptPrinted()
        ? purchaseResponse.GetCustomerReceipt().trim()
        : `# PRINTED FROM EFTPOS`
    );
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const purchaseResponse = new PurchaseResponse(txStateResponse);

  flowMsg.Info(`# WOOHOO - WE GOT PAID!`);
  flowMsg.Info(`# POS Reference: ${purchaseResponse.GetResponseValue('pos_ref_id')}`);
  flowMsg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
  flowMsg.Info(`# Customer Receipt:`);

  receipt.Info(
    !purchaseResponse.WasCustomerReceiptPrinted()
      ? purchaseResponse.GetCustomerReceipt().trim()
      : `# PRINTED FROM EFTPOS`
  );

  flowMsg.Info(`# PURCHASE: ${purchaseResponse.GetPurchaseAmount()}`);
  flowMsg.Info(`# TIP: ${purchaseResponse.GetTipAmount()}`);
  flowMsg.Info(`# SURCHARGE: ${purchaseResponse.GetSurchargeAmount()}`);
  flowMsg.Info(`# CASHOUT: ${purchaseResponse.GetCashoutAmount()}`);
  flowMsg.Info(`# BANKED NON-CASH AMOUNT: ${purchaseResponse.GetBankNonCashAmount()}`);
  flowMsg.Info(`# BANKED CASH AMOUNT: ${purchaseResponse.GetBankCashAmount()}`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER WE GOT PAID OR NOT :/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.`);
  flowMsg.Info(`# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.`);
}

export default {
  handleFailedTransaction,
  handleSuccessfulTransaction,
  handleUnknownState,
  initiatePurchase,
  initiateZipPurchase,
};
