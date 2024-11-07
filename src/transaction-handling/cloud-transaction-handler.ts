import { TransactionHandler } from './transaction-handler';
import { SpiCloudPairing } from '../redux/reducers/PairingSlice/interfaces';
import { selectCloudPairing } from '../redux/reducers/PairingSlice/pairingSelectors';
import { ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';
import { signedRequestInit } from '../utils/common/signRequest';

/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove this
export class CloudTransactionHandler extends TransactionHandler<SpiCloudPairing> {
  get terminalId(): string | undefined {
    return this.terminal?.pairingId;
  }

  get isTerminalConnected(): boolean {
    // TODO: Assuming cloud is considered always on?
    return true;
  }

  get receipt(): ITerminalReceiptFormatProps | undefined {
    // TODO: Where will receipt come from?
    return undefined;
  }

  get txFlow(): ITxFlow | undefined {
    // TODO: Simulate txFlow based on cloud API responses?
    return undefined;
  }

  async initiatePurchase(
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    surchargeAmount: number,
    promptForCashout: boolean
  ): Promise<void> {
    // TODO: Support cashout

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
        // TODO: Handle errors
        // return; // TODO: Uncomment
      }

      // TODO: Start polling for transaction status
    } catch (error) {
      // TODO: Handle errors
      // eslint-disable-next-line no-console
      console.error('Error initiating purchase', error);
    }
  }

  selectTerminal = (id: string) => selectCloudPairing(id);
}
