import { RequestIdHelper, Settlement } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateSettlement(flowMsg: Logger, spi: Spi) {
  const res = spi.InitiateSettleTx(RequestIdHelper.Id('settle'));

  flowMsg.Info(
    res.Initiated
      ? '# Settle Initiated. Will be updated with Progress.'
      : `# Could not initiate settle: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# SETTLEMENT FAILED!`);

  if (txStateResponse != null) {
    const settlementResponse = new Settlement(txStateResponse);

    flowMsg.Info(`# Response: ${settlementResponse.GetResponseText()}`);
    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Merchant Receipt:`);

    receipt.Info(settlementResponse.GetReceipt());
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# SETTLEMENT SUCCESSFUL!`);
  if (txStateResponse != null) {
    const settlementResponse = new Settlement(txStateResponse);

    flowMsg.Info(`# Response: ${settlementResponse.GetResponseText()}`);
    flowMsg.Info(`# Merchant Receipt:`);

    receipt.Info(settlementResponse.GetReceipt().trim());

    flowMsg.Info(`# Period Start: ${settlementResponse.GetPeriodStartTime()}`);
    flowMsg.Info(`# Period End: ${settlementResponse.GetPeriodEndTime()}`);
    flowMsg.Info(`# Settlement Time: ${settlementResponse.GetTriggeredTime()}`);
    flowMsg.Info(`# Transaction Range: ${settlementResponse.GetTransactionRange()}`);
    flowMsg.Info(`# Terminal Id: ${settlementResponse.GetTerminalId()}`);
    flowMsg.Info(`# Total TX Count: ${settlementResponse.GetTotalCount()}`);
    flowMsg.Info(`# Total TX Value: $${(settlementResponse.GetTotalValue() / 100.0).toFixed(2)}`);
    flowMsg.Info(`# By Acquirer TX Count: ${settlementResponse.GetSettleByAcquirerCount()}`);
    flowMsg.Info(`# By Acquirer TX Value: $${(settlementResponse.GetSettleByAcquirerValue() / 100.0).toFixed(2)}`);
    flowMsg.Info(`# SCHEME SETTLEMENTS:`);

    const schemes = settlementResponse.GetSchemeSettlementEntries();
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
  initiateSettlement,
};
