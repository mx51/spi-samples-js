// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CryptoJS from 'crypto-js';
import { TransactionHandler } from './transaction-handler';
import { SpiCloudPairing } from '../redux/reducers/PairingSlice/interfaces';
import { selectCloudPairing } from '../redux/reducers/PairingSlice/pairingSelectors';
import { ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */ // TODO: Remove this
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
    try {
      // TODO: Throw if no terminal?

      const { keyId, signingSecret, spiCloudApiBaseUrl } = this.terminal!;
      const url = new URL(`${spiCloudApiBaseUrl}/api/v1/transactions`);
      const now = Math.floor(Date.now() / 1000);
      const method = 'POST';
      const requestBody = {
        purchase_details: {
          purchase_amount: purchaseAmount,
          tip_amount: tipAmount,
          surcharge_amount: surchargeAmount,
        },
      };

      const signatureInput = `("@method" "@authority" "@request-target" "content-digest");created=${now};alg="hmac-sha256";keyid="${keyId}"`;
      const contentDigest = CryptoJS.SHA256(JSON.stringify(requestBody)).toString(CryptoJS.enc.Base64);
      // Line breaks are required for the signature to be valid
      const dataToEncrypt =
        `"@method": ${method}` +
        '\n' +
        `"@authority": ${url.host}` +
        '\n' +
        `"@request-target": ${url.pathname}` +
        '\n' +
        `"content-digest": sha-256=:${contentDigest}:` +
        '\n' +
        `"@signature-params": ${signatureInput}`;
      const signature = CryptoJS.HmacSHA256(dataToEncrypt, signingSecret).toString(CryptoJS.enc.Base64);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Signature: `sig1=:${signature}:`,
          'Signature-Input': `sig1=${signatureInput}`,
          'Content-Digest': `sha-256=:${contentDigest}:`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const result = await response.json();
      console.log('Txn result', result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error pairing', error);
    }
  }

  selectTerminal = (id: string) => selectCloudPairing(id);
}
