import { AccountVerifyResponse } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateAccountVerify(flowMsg: Logger, spiPreauth: any) {
  const posRefId = `actvfy-${new Date().toISOString()}`;
  const res = spiPreauth.InitiateAccountVerifyTx(posRefId);

  flowMsg.Info(
    res.Initiated
      ? '# Verify Initiated. Will be updated with Progress.'
      : `# Could not initiate account verify request: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# ACCOUNT VERIFICATION FAILED :(`);

  if (txStateResponse != null) {
    const acctVerifyResponse = new AccountVerifyResponse(txStateResponse);
    const details = acctVerifyResponse.Details;

    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Error Detail: ${txStateResponse.GetErrorDetail()}`);

    receipt.Info(!details.WasMerchantReceiptPrinted() ? details.GetMerchantReceipt().trim() : `# PRINTED FROM EFTPOS`);
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const acctVerifyResponse = new AccountVerifyResponse(txStateResponse);
  const details = acctVerifyResponse.Details;

  flowMsg.Info(`# ACCOUNT VERIFICATION SUCCESS`);
  flowMsg.Info(`# Response: ${details.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${details.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${details.SchemeName}`);
  flowMsg.Info(`# Merchant Receipt:`);

  receipt.Info(!details.WasCustomerReceiptPrinted() ? details.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER ACCOUNT VERIFICATION WENT THROUGH OR NOT:/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.`);
  flowMsg.Info(`# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.`);
}

export default {
  handleFailedTransaction,
  handleSuccessfulTransaction,
  handleUnknownState,
  initiateAccountVerify,
};
