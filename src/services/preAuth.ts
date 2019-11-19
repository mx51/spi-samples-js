import { PreauthResponse, PurchaseResponse } from '@assemblypayments/spi-client-js';

// Initiate a transaction

function initiatePreauthOpen(flowMsg: Logger, spiPreauth: SpiPreauth, preauthAmount: number) {
  const posRefId = `propen-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateOpenTx(posRefId, preauthAmount);

  flowMsg.Info(
    res.Initiated
      ? '# Preauth Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth request: ${res.Message}. Please Retry.`
  );
}

function initiatePreauthIncrease(flowMsg: Logger, spiPreauth: SpiPreauth, amount: number, preauthId: string) {
  const ref = `prtopup-${preauthId}-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateTopupTx(ref, preauthId, amount);

  flowMsg.Info(
    res.Initiated
      ? '# Preauth topup Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth topup request: ${res.Message}. Please Retry.`
  );
}

function initiatePreauthDecrease(flowMsg: Logger, spiPreauth: SpiPreauth, amount: number, preauthId: string) {
  const ref = `prtopd-${preauthId}-${new Date().toISOString()}`;
  const res = spiPreauth.InitiatePartialCancellationTx(ref, preauthId, amount);

  flowMsg.Info(
    res.Initiated
      ? '# Preauth topdown Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth topdown request: ${res.Message}. Please Retry.`
  );
}

function initiatePreauthExtension(flowMsg: Logger, spiPreauth: SpiPreauth, preauthId: string) {
  const ref = `prext-${preauthId}-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateExtendTx(ref, preauthId);
  flowMsg.Info(
    res.Initiated
      ? '# Preauth extend Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth extend request: ${res.Message}. Please Retry.`
  );
}

function initiatePreauthCancellation(flowMsg: Logger, spiPreauth: SpiPreauth, preauthId: string) {
  const ref = `prcancel-${preauthId}-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateCancelTx(ref, preauthId);

  flowMsg.Info(
    res.Initiated
      ? '# Preauth cancel Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth cancel request: ${res.Message}. Please Retry.`
  );
}

function initiatePreauthCompletion(
  flowMsg: Logger,
  spiPreauth: SpiPreauth,
  amount: number,
  surcharge: number,
  preauthId: string
) {
  const ref = `prcomp-${preauthId}-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateCompletionTx(ref, preauthId, amount, surcharge);

  flowMsg.Info(
    res.Initiated
      ? '# Preauth complete Initiated. Will be updated with Progress.'
      : `# Could not initiate preauth complete request: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# PREAUTH TRANSACTION FAILED :(`);

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
  const preauthResponse = new PreauthResponse(txStateResponse);
  const details = preauthResponse.Details;

  flowMsg.Info(`# PREAUTH RESULT - SUCCESS`);
  flowMsg.Info(`# PREAUTH-ID: ${preauthResponse.PreauthId}`);
  flowMsg.Info(`# NEW BALANCE AMOUNT: ${preauthResponse.GetBalanceAmount()}`);
  flowMsg.Info(`# PREV BALANCE AMOUNT: ${preauthResponse.GetPreviousBalanceAmount()}`);
  flowMsg.Info(`# COMPLETION AMOUNT: ${preauthResponse.GetCompletionAmount()}`);
  flowMsg.Info(`# Response: ${details.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${details.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${details.SchemeName}`);
  flowMsg.Info(`# Customer Receipt:`);

  receipt.Info(!details.WasCustomerReceiptPrinted() ? details.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER PREAUTH TRANSACTION WENT THROUGH OR NOT:/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.`);
  flowMsg.Info(`# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.`);
}

export default {
  handleFailedTransaction,
  handleSuccessfulTransaction,
  handleUnknownState,
  initiatePreauthCancellation,
  initiatePreauthCompletion,
  initiatePreauthDecrease,
  initiatePreauthExtension,
  initiatePreauthIncrease,
  initiatePreauthOpen,
};
