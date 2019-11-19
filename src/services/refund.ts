import { RefundResponse } from '@assemblypayments/spi-client-js';

// Initiate a transaction
function initiateRefund(flowMsg: Logger, spi: Spi, refundAmount: number, isMerchantPasswordSuppressed: boolean) {
  const posRefId = `refund-${new Date().toISOString()}`;
  const res = spi.InitiateRefundTx(posRefId, refundAmount, isMerchantPasswordSuppressed);

  flowMsg.Info(
    res.Initiated
      ? '# Refund Initiated. Will be updated with Progress.'
      : `# Could not initiate refund: ${res.Message}. Please Retry.`
  );
}

function initiateZipRefund(
  flowMsg: Logger,
  options: Options,
  spi: Spi,
  refundAmount: number,
  originalReceiptNumber: string
) {
  const res = spi.InitiateZipRefundTx(`rfnd-${new Date().toISOString()}`, refundAmount, originalReceiptNumber, options);

  if (res.Initiated) {
    flowMsg.Info(`# Refund Initiated. Will be updated with Progress.`);
  } else {
    flowMsg.Info(`# Could not initiate refund: ${res.Message}. Please Retry.`);
  }
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# REFUND FAILED!`);

  if (txStateResponse !== null) {
    const refundResponse = new RefundResponse(txStateResponse);

    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Error Detail: ${txStateResponse.GetErrorDetail()}`);
    flowMsg.Info(`# Response: ${refundResponse.GetResponseText()}`);
    flowMsg.Info(`# RRN: ${refundResponse.GetRRN()}`);
    flowMsg.Info(`# Scheme: ${refundResponse.SchemeName}`);
    flowMsg.Info(`# Customer Receipt:`);

    receipt.Info(
      !refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`
    );
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const refundResponse = new RefundResponse(txStateResponse);

  flowMsg.Info(`# REFUND GIVEN - OH WELL!`);
  flowMsg.Info(`# Response: ${refundResponse.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${refundResponse.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${refundResponse.SchemeName}`);
  flowMsg.Info(`# Customer Receipt:`);

  receipt.Info(
    !refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`
  );

  flowMsg.Info(`# REFUNDED AMOUNT: ${refundResponse.GetRefundAmount()}`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER THE REFUND WENT THROUGH OR NOT :/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# YOU CAN THE TAKE THE APPROPRIATE ACTION.`);
}

export default {
  handleFailedTransaction,
  handleSuccessfulTransaction,
  handleUnknownState,
  initiateRefund,
  initiateZipRefund,
};
