import { TransactionType } from '@mx51/spi-client-js';
import {
  IPairingFlow,
  ITerminalProps,
  ITerminalReceiptFormatProps,
  ITxFlow,
} from '../../redux/reducers/TerminalSlice/interfaces';

export function generateTerminalMockData({
  terminalId,
  pairingFlow = null,
  txFlow = null,
  receipt,
}: {
  terminalId: string;
  pairingFlow: IPairingFlow | null;
  txFlow: ITxFlow | null;
  receipt?: ITerminalReceiptFormatProps;
}): ITerminalProps {
  return {
    autoAddress: true,
    reconnecting: false,
    secureWebSocket: false,
    acquirerCode: 'gko',
    deviceAddress: 'ws://192.168.102.9',
    posId: 'Testing321',
    serialNumber: terminalId,
    testMode: false,
    flow: 'Idle',
    id: terminalId,
    pairingFlow,
    posVersion: '1.4.0',
    secrets: {
      encKey: '',
      hmacKey: '',
    },
    settings: null,
    status: 'PairedConnected',
    terminalStatus: 'Idle',
    txFlow,
    txMessage: null,
    pluginVersion: '3.9.0',
    merchantId: '3000001',
    terminalId: '300000107',
    batteryLevel: '62',
    receipt,
  };
}

export const generateTxFlowMockData = ({
  success,
  purchaseAmount,
  preAuthAmount = 0,
  reduceAmount = 0,
  topupAmount = 0,
  tipAmount = 0,
  bankCashAmount = 0,
  surchargeAmount = 0,
  override = false,
  type = TransactionType.Purchase,
  eventName = 'purchase',
}: {
  purchaseAmount: number;
  preAuthAmount?: number;
  reduceAmount?: number;
  topupAmount?: number;
  tipAmount?: number;
  bankCashAmount?: number;
  surchargeAmount?: number;
  balanceAmount?: number;
  success: 'Unknown' | 'Success' | 'Failed';
  override?: boolean;
  type?: string;
  eventName?: string;
}): ITxFlow => ({
  posRefId: `${eventName}-2024-01-15T00:49:56.541Z`,
  id: `${eventName}-2024-01-15T00:49:56.541Z`,
  type,
  displayMessage: 'Purchase Transaction Ended.',
  amountCents: purchaseAmount,
  awaitingSignatureCheck: false,
  finished: true,
  success,
  signatureRequiredMessage: null,
  completedTime: 1705279809047,
  receipt: '',
  request: {
    id: 'prchs9',
    eventName,
    data: {
      preAuthAmount,
      reduceAmount,
      topupAmount,
      posRefId: `${eventName}-2024-01-15T00:49:56.541Z`,
      purchaseAmount,
      tipAmount,
      bankCashAmount,
      promptForCashout: false,
      surchargeAmount,
      promptForCustomerCopy: false,
      printForSignatureRequiredTransactions: false,
      printMerchantCopy: false,
      customerReceiptHeader: '',
      customerReceiptFooter: '',
      merchantReceiptHeader: '',
      merchantReceiptFooter: '',
    },
    posId: '',
    decryptedJson: '',
  },
  response: {
    data: {
      rrn: override ? '001705319436' : '',
      schemeAppName: override ? 'AMEX' : '',
      schemeName: override ? 'American Express' : '',
      merchantReceipt: override ? '' : '',
      transactionType: override ? '' : '',
      hostResponseText: override ? 'APPROVED' : '',
      hostResponseCode: override ? '000' : '',
      purchaseAmount: override ? 0 : purchaseAmount,
      surchargeAmount: override ? 0 : surchargeAmount,
      bankCashAmount: override ? 0 : bankCashAmount,
      tipAmount: override ? 0 : tipAmount,
      preAuthAmount: override ? 0 : preAuthAmount,
      topupAmount: override ? 0 : topupAmount,
      reduceAmount: override ? 0 : reduceAmount,
      preAuthId: '',
      success: true,
    },
  },
  override,
});
