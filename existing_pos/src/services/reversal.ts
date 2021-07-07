import { ReversalResponse } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateReversal(flowMsg: Logger, spi: Spi, posRefId: string) {
  const res = spi.InitiateReversal(posRefId);

  flowMsg.Info(
    res.Initiated
      ? '# Reversal Initiated. Will be updated with Progress.'
      : `# Could not initiate reversal: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: any, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# WE DID NOT GET TRANSACTION-REVERTED :(`);

  if (txStateResponse != null) {
    const reversalResponse = new ReversalResponse(txStateResponse);

    flowMsg.Info(`# Error Detail: ${reversalResponse.GetErrorDetail()}`);
    flowMsg.Info(`# Error Reason:: ${reversalResponse.GetErrorReason()}`);
    flowMsg.Info(`# Success: ${reversalResponse.Success}`);
    flowMsg.Info(`# PosRefID: ${reversalResponse.PosRefId}`);
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const reversalResponse = new ReversalResponse(txStateResponse);
  flowMsg.Info(`# WOOHOO - REVERSAL SUCCESSFULL`);
  flowMsg.Info(`# Success: ${reversalResponse.Success}`);
  flowMsg.Info(`# PosRefID: ${reversalResponse.PosRefId}`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER THE REVERSAL WENT THROUGH OR NOT :/`);
  flowMsg.Info(`# YOU CAN THE TAKE THE APPROPRIATE ACTION.`);
}

export default { handleFailedTransaction, handleSuccessfulTransaction, handleUnknownState, initiateReversal };
