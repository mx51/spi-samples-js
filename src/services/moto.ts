import { MotoPurchaseResponse } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateMotoPurchase(
  flowMsg: Logger,
  spi: Spi,
  purchaseAmount: number,
  surchargeAmount: number,
  isMerchantPasswordSuppressed: boolean
) {
  const posRefId = `cashout-${new Date().toISOString()}`;
  const res = spi.InitiateMotoPurchaseTx(posRefId, purchaseAmount, surchargeAmount, isMerchantPasswordSuppressed);

  flowMsg.Info(
    res.Initiated
      ? '# MOTO purchase Initiated. Will be updated with Progress.'
      : `# Could not initiate moto purchase: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# WE DID NOT GET MOTO-PAID :(`);

  if (txStateResponse != null) {
    const motoResponse = new MotoPurchaseResponse(txStateResponse);
    const purchaseResponse = motoResponse.PurchaseResponse;

    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Error Detail: ${txStateResponse.GetErrorDetail()}`);
    flowMsg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
    flowMsg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
    flowMsg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
    flowMsg.Info(`# Customer Receipt:`);

    receipt.Info(purchaseResponse.GetCustomerReceipt().trim());
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const motoResponse = new MotoPurchaseResponse(txStateResponse);
  const purchaseResponse = motoResponse.PurchaseResponse;

  flowMsg.Info(`# WOOHOO - WE GOT MOTO-PAID!`);
  flowMsg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
  flowMsg.Info(`# Card Entry: ${purchaseResponse.GetCardEntry()}`);
  flowMsg.Info(`# Customer Receipt:`);

  receipt.Info(
    !purchaseResponse.WasCustomerReceiptPrinted()
      ? purchaseResponse.GetCustomerReceipt().trim()
      : `# PRINTED FROM EFTPOS`
  );

  flowMsg.Info(`# PURCHASE: ${purchaseResponse.GetPurchaseAmount()}`);
  flowMsg.Info(`# BANKED NON-CASH AMOUNT: ${purchaseResponse.GetBankNonCashAmount()}`);
  flowMsg.Info(`# BANKED CASH AMOUNT: ${purchaseResponse.GetBankCashAmount()}`);
  flowMsg.Info(`# SURCHARGE: ${purchaseResponse.GetSurchargeAmount()}`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER THE MOTO WENT THROUGH OR NOT :/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# YOU CAN THE TAKE THE APPROPRIATE ACTION.`);
}

export default { handleFailedTransaction, handleSuccessfulTransaction, handleUnknownState, initiateMotoPurchase };
