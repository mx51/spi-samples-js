import { GetLastTransactionResponse, PurchaseResponse, SuccessState, TransactionType } from '@mx51/spi-client-js';
import Pos from './_common/pos';

// Handle generic transaction completion flows
function acceptSignature(spi: Spi) {
  spi.AcceptSignature(true);
}

function declineSignature(spi: Spi) {
  spi.AcceptSignature(false);
}

function cancelTransaction(spi: Spi) {
  spi.CancelTransaction();
}

function submitAuthCode(flowMsg: Logger, spi: Spi, authCode: string) {
  const res = spi.SubmitAuthCode(authCode);

  flowMsg.Info(res.ValidFormat ? `# Auth code submitted` : `# Invalid Code Format. ${res.Message}. Try Again.`);
}

function acknowledgeCompletion(flowMsg: Logger, spi: Spi, printStatusAndActions: Function) {
  spi.AckFlowEndedAndBackToIdle();

  flowMsg.Clear();
  flowMsg.Info('Select from the options below');
  printStatusAndActions();
}

function acknowledgeCancellation(flowMsg: Logger, spi: Spi, printStatusAndActions: Function) {
  spi.AckFlowEndedAndBackToIdle();

  flowMsg.Clear();
  flowMsg.Info('Order Cancelled');
  printStatusAndActions();
}

function printReceipt(spi: Spi, header: string, footer: string, apiKey: string) {
  const payload = Pos.sanitizePrintText(header + footer);
  spi.PrintReceipt(apiKey, payload);
}

// Handle the generic start of a transaction
function handleTransaction(flowMsg: Logger, txState: TransactionFlowState) {
  flowMsg.Info('### TX PROCESS UPDATE ###');
  flowMsg.Info(`# ${txState.DisplayMessage}`);
  flowMsg.Info(`# PosRefId: ${txState.PosRefId}`);
  flowMsg.Info(`# Type: ${txState.Type}`);
  flowMsg.Info(`# Request Amount: $${(txState.AmountCents / 100.0).toFixed(2)}`);
  flowMsg.Info(`# Waiting For Signature: ${txState.AwaitingSignatureCheck}`);
  flowMsg.Info(`# Attempting to Cancel : ${txState.AttemptingToCancel}`);
  flowMsg.Info(`# Finished: ${txState.Finished}`);
  flowMsg.Info(`# Success: ${txState.Success}`);
}

// Recovery operations

function initiateRecovery(flowMsg: Logger, spi: Spi, posRefId: string) {
  flowMsg.Clear();

  const res = spi.InitiateRecovery(posRefId, TransactionType.Purchase);

  flowMsg.Info(
    res.Initiated
      ? '# Recovery Initiated. Will be updated with Progress.'
      : `# Could not initiate recovery. ${res.Message}. Please Retry.`
  );
}

function initiateGetLastTransaction(flowMsg: Logger, spi: Spi) {
  const res = spi.InitiateGetLastTx();

  flowMsg.Info(
    res.Initiated
      ? '# GLT Initiated. Will be updated with Progress.'
      : `# Could not initiate GLT: ${res.Message}. Please Retry.`
  );
}

function handleGetLastTransaction(
  flowMsg: Logger,
  receipt: Logger,
  spi: Spi,
  txState: TransactionFlowState,
  posRefId?: string
) {
  if (txState.Response != null) {
    const gltResponse = new GetLastTransactionResponse(txState.Response);
    // const posRefId = (document.getElementById('pos_ref_id') as HTMLInputElement).value;

    if (posRefId && posRefId.length > 1) {
      // User specified that he intended to retrieve a specific tx by pos_ref_id
      // This is how you can use a handy function to match it.
      const success = spi.GltMatch(gltResponse, posRefId);
      if (success === SuccessState.Unknown) {
        flowMsg.Info('# Did not retrieve Expected Transaction. Here is what we got:');
      } else {
        flowMsg.Info('# Tx Matched Expected Purchase Request.');
      }
    }

    const purchaseResponse = new PurchaseResponse(txState.Response);
    flowMsg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
    flowMsg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
    flowMsg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
    flowMsg.Info(`# Error: ${txState.Response.GetError()}`);
    flowMsg.Info(`# Customer Receipt:`);
    receipt.Info(purchaseResponse.GetCustomerReceipt().trim());
  } else {
    // We did not even get a response, like in the case of a time-out.
    flowMsg.Info('# Could Not Retrieve Last Transaction.');
  }
}

export default {
  acceptSignature,
  acknowledgeCancellation,
  acknowledgeCompletion,
  cancelTransaction,
  declineSignature,
  handleGetLastTransaction,
  handleTransaction,
  initiateGetLastTransaction,
  initiateRecovery,
  printReceipt,
  submitAuthCode,
};
