import { CashoutOnlyResponse } from '@mx51/spi-client-js';

// Initiate a transaction
function initiateCashout(flowMsg: Logger, log: Console, spi: Spi, cashoutAmount: number, surchargeAmount: number) {
  if (!(cashoutAmount > 0)) {
    log.info('Cashout amount must be greater than 0');
    return;
  }

  const posRefId = `cashout-${new Date().toISOString()}`;
  const res = spi.InitiateCashoutOnlyTx(posRefId, cashoutAmount, surchargeAmount);

  flowMsg.Info(
    res.Initiated
      ? '# Cashout Initiated. Will be updated with Progress.'
      : `# Could not initiate cashout: ${res.Message}. Please Retry.`
  );
}

// Completed transaction handlers

function handleFailedTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  flowMsg.Info(`# CASHOUT FAILED!`);

  if (txStateResponse != null) {
    const cashoutResponse = new CashoutOnlyResponse(txStateResponse);

    flowMsg.Info(`# Error: ${txStateResponse.GetError()}`);
    flowMsg.Info(`# Error Detail: ${txStateResponse.GetErrorDetail()}`);
    flowMsg.Info(`# Response: ${cashoutResponse.GetResponseText()}`);
    flowMsg.Info(`# RRN: ${cashoutResponse.GetRRN()}`);
    flowMsg.Info(`# Scheme: ${cashoutResponse.SchemeName}`);
    flowMsg.Info(`# Customer Receipt:`);

    receipt.Info(cashoutResponse.GetCustomerReceipt());
  }
}

function handleSuccessfulTransaction(flowMsg: Logger, receipt: Logger, txStateResponse: TransactionFlowState) {
  const cashoutResponse = new CashoutOnlyResponse(txStateResponse);

  flowMsg.Info(`# CASH-OUT SUCCESSFUL - HAND THEM THE CASH!`);
  flowMsg.Info(`# Response: ${cashoutResponse.GetResponseText()}`);
  flowMsg.Info(`# RRN: ${cashoutResponse.GetRRN()}`);
  flowMsg.Info(`# Scheme: ${cashoutResponse.SchemeName}`);
  flowMsg.Info(`# Customer Receipt:`);

  receipt.Info(
    !cashoutResponse.WasCustomerReceiptPrinted() ? cashoutResponse.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`
  );

  flowMsg.Info(`# CASHOUT: ${cashoutResponse.GetCashoutAmount()}`);
  flowMsg.Info(`# BANKED NON-CASH AMOUNT: ${cashoutResponse.GetBankNonCashAmount()}`);
  flowMsg.Info(`# BANKED CASH AMOUNT: ${cashoutResponse.GetBankCashAmount()}`);
  flowMsg.Info(`# SURCHARGE: ${cashoutResponse.GetSurchargeAmount()}`);
}

function handleUnknownState(flowMsg: Logger) {
  flowMsg.Info(`# WE'RE NOT QUITE SURE WHETHER THE CASHOUT WENT THROUGH OR NOT :/`);
  flowMsg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
  flowMsg.Info(`# YOU CAN THE TAKE THE APPROPRIATE ACTION.`);
}

export default { handleFailedTransaction, handleSuccessfulTransaction, handleUnknownState, initiateCashout };
