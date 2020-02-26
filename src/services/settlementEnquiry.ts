import { RequestIdHelper, Settlement } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateSettlementEnquiry(flowMsg: Logger, spi: Spi) {
  const res = spi.InitiateSettlementEnquiry(RequestIdHelper.Id('stlenq'));

  flowMsg.Info(
    res.Initiated
      ? '# Settle enquiry Initiated. Will be updated with Progress.'
      : `# Could not initiate settle enquiry: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# SETTLEMENT ENQUIRY FAILED!`);

  if (txStateResponse != null) {
    const settleResponse = new Settlement(txStateResponse);

    flowMsg.Info(`# Response: ${settleResponse.GetResponseText()}`);
    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Merchant Receipt:`);

    receipt.Info(settleResponse.GetReceipt());
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# SETTLEMENT ENQUIRY SUCCESSFUL!`);

  if (txStateResponse != null) {
    const settleResponse = new Settlement(txStateResponse);

    flowMsg.Info(`# Response: ${settleResponse.GetResponseText()}`);
    flowMsg.Info(`# Merchant Receipt:`);

    receipt.Info(settleResponse.GetReceipt().trim());

    flowMsg.Info(`# Period Start: ${settleResponse.GetPeriodStartTime()}`);
    flowMsg.Info(`# Period End: ${settleResponse.GetPeriodEndTime()}`);
    flowMsg.Info(`# Settlement Time: ${settleResponse.GetTriggeredTime()}`);
    flowMsg.Info(`# Transaction Range: ${settleResponse.GetTransactionRange()}`);
    flowMsg.Info(`# Terminal Id: ${settleResponse.GetTerminalId()}`);
    flowMsg.Info(`# Total TX Count: ${settleResponse.GetTotalCount()}`);
    flowMsg.Info(`# Total TX Value: $${(settleResponse.GetTotalValue() / 100.0).toFixed(2)}`);
    flowMsg.Info(`# By Acquirer TX Count: ${settleResponse.GetSettleByAcquirerCount()}`);
    flowMsg.Info(`# By Acquirer TX Value: $${(settleResponse.GetSettleByAcquirerValue() / 100.0).toFixed(2)}`);
    flowMsg.Info(`# SCHEME SETTLEMENTS:`);

    const schemes = settleResponse.GetSchemeSettlementEntries();
    schemes.forEach((s: any) => {
      flowMsg.Info(`# ${JSON.stringify(schemes[s])}`);
    });
  }
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# SETTLEMENT ENQUIRY RESULT UNKNOWN!`);
}

export default {
  handleFailedTransaction,
  handleSuccessfulTransaction,
  handleUnknownState,
  initiateSettlementEnquiry,
};
