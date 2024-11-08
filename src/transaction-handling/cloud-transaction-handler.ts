import { TransactionHandler } from './transaction-handler';
import { SpiCloudPairing } from '../redux/reducers/PairingSlice/interfaces';
import { selectCloudPairing } from '../redux/reducers/PairingSlice/pairingSelectors';
import { ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';
import { signedRequestInit } from '../utils/common/signRequest';

interface TransactionResponse {
  data: {
    action_form?: unknown; // TODO: Type this
    id: string;
    message: string;
    status: string;
    version: number;
  };
}

/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: FE-20 - Remove this when all vars are used
export class CloudTransactionHandler extends TransactionHandler<SpiCloudPairing> {
  get terminalId(): string | undefined {
    return this.terminal?.pairingId;
  }

  get isTerminalConnected(): boolean {
    // TODO: FE-20 - Assuming cloud is considered always on?
    return true;
  }

  get receipt(): ITerminalReceiptFormatProps | undefined {
    // TODO: FE-20 - Where will receipt come from?
    return undefined;
  }

  get txFlow(): ITxFlow | undefined {
    // TODO: FE-20 - Simulate txFlow based on cloud API responses?
    return undefined;
  }

  private inProgressTransactionId?: string;

  async cancelTransaction(): Promise<void> {
    const { keyId, signingSecret, spiCloudApiBaseUrl } = this.terminal!;
    const url = `${spiCloudApiBaseUrl}/api/v1/transactions/${this.inProgressTransactionId}/cancel`;

    try {
      const signedRequest = await signedRequestInit(keyId, signingSecret, url, 'POST', {});
      const response = await fetch(url, signedRequest);

      if (!response.ok) {
        // TODO: FE-20 - Handle errors and return early
        return;
      }

      const cancelResponse: TransactionResponse = await response.json();

      // eslint-disable-next-line no-console
      console.log(cancelResponse);

      // TODO: Update txFlow to show the correct transaction progress modal
      //  See examples for local terminal below
    } catch (error) {
      // TODO: FE-20 - Handle errors
      // eslint-disable-next-line no-console
      console.error('Error initiating purchase', error);
    }
  }

  async initiatePurchase(
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    surchargeAmount: number,
    promptForCashout: boolean
  ): Promise<void> {
    // TODO: FE-20 - Support cashout

    const { keyId, signingSecret, spiCloudApiBaseUrl } = this.terminal!;
    const url = `${spiCloudApiBaseUrl}/api/v1/transactions`;
    const requestBody = {
      purchase_details: {
        purchase_amount: purchaseAmount,
        surcharge_amount: surchargeAmount,
        tip_amount: tipAmount,
      },
    };

    try {
      const signedRequest = await signedRequestInit(keyId, signingSecret, url, 'POST', requestBody);
      const response = await fetch(url, signedRequest);

      if (!response.ok) {
        // TODO: FE-20 - Handle errors and return early
        return;
      }

      const purchaseResponse: TransactionResponse = await response.json();

      this.inProgressTransactionId = purchaseResponse.data.id;

      // TODO: FE-20 - Start polling for transaction status if all ok
    } catch (error) {
      // TODO: FE-20 - Handle errors
      // eslint-disable-next-line no-console
      console.error('Error initiating purchase', error);
    }
  }

  selectTerminal = (id: string) => selectCloudPairing(id);
}

/**
 * txFlow for cancel transaction via local terminal
 *
 * Part 1:
 * {
 *     "posRefId": "purchase-2024-11-08T04:42:41.056Z",
 *     "id": "purchase-2024-11-08T04:42:41.056Z",
 *     "type": "Purchase",
 *     "displayMessage": "Attempting to Cancel Transaction...",
 *     "amountCents": 380,
 *     "awaitingSignatureCheck": false,
 *     "finished": false,
 *     "success": "Unknown",
 *     "signatureRequiredMessage": null,
 *     "completedTime": null,
 *     "attemptingToCancel": true,
 *     "cancelAttemptTime": 1731040962918,
 *     "request": {
 *         "id": "prchs7",
 *         "eventName": "purchase",
 *         "data": {
 *             "posRefId": "purchase-2024-11-08T04:42:41.056Z",
 *             "purchaseAmount": 380,
 *             "tipAmount": 0,
 *             "bankCashAmount": 0,
 *             "promptForCashout": false,
 *             "surchargeAmount": 0,
 *             "promptForCustomerCopy": false,
 *             "printForSignatureRequiredTransactions": false,
 *             "printMerchantCopy": false,
 *             "customerReceiptHeader": "",
 *             "customerReceiptFooter": "",
 *             "merchantReceiptHeader": "",
 *             "merchantReceiptFooter": ""
 *         },
 *         "posId": "",
 *         "decryptedJson": ""
 *     },
 *     "response": {
 *         "data": {
 *             "purchaseAmount": 0,
 *             "surchargeAmount": 0,
 *             "bankCashAmount": 0,
 *             "tipAmount": 0,
 *             "preAuthAmount": 0,
 *             "topupAmount": 0,
 *             "reduceAmount": 0,
 *             "completionAmount": 0,
 *             "refundAmount": 0,
 *             "balanceAmount": 0
 *         }
 *     }
 * }
 *
 * Part 2:
 * {
 *     "posRefId": "purchase-2024-11-08T04:42:41.056Z",
 *     "id": "purchase-2024-11-08T04:42:41.056Z",
 *     "type": "Purchase",
 *     "displayMessage": "Purchase Transaction Ended.",
 *     "amountCents": 380,
 *     "awaitingSignatureCheck": false,
 *     "finished": true,
 *     "success": "Failed",
 *     "signatureRequiredMessage": null,
 *     "completedTime": 1731040963667,
 *     "attemptingToCancel": false,
 *     "cancelAttemptTime": 1731040962918,
 *     "request": {
 *         "id": "prchs7",
 *         "eventName": "purchase",
 *         "data": {
 *             "posRefId": "purchase-2024-11-08T04:42:41.056Z",
 *             "purchaseAmount": 380,
 *             "tipAmount": 0,
 *             "bankCashAmount": 0,
 *             "promptForCashout": false,
 *             "surchargeAmount": 0,
 *             "promptForCustomerCopy": false,
 *             "printForSignatureRequiredTransactions": false,
 *             "printMerchantCopy": false,
 *             "customerReceiptHeader": "",
 *             "customerReceiptFooter": "",
 *             "merchantReceiptHeader": "",
 *             "merchantReceiptFooter": ""
 *         },
 *         "posId": "",
 *         "decryptedJson": ""
 *     },
 *     "response": {
 *         "data": {
 *             "schemeName": "unknown",
 *             "hostResponseCode": "511",
 *             "purchaseAmount": 0,
 *             "surchargeAmount": 0,
 *             "bankCashAmount": 0,
 *             "tipAmount": 0,
 *             "preAuthAmount": 0,
 *             "topupAmount": 0,
 *             "reduceAmount": 0,
 *             "completionAmount": 0,
 *             "refundAmount": 0,
 *             "balanceAmount": 0
 *         }
 *     }
 * }
 */
