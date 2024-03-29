import { TransactionType } from '@mx51/spi-client-js';
import {
  IPairingFlow,
  ITerminalProps,
  ITerminalReceiptFormatProps,
  ITxFlow,
} from '../../redux/reducers/TerminalSlice/interfaces';
import { TxLogItem } from '../../services/txLogService';

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

export const generateTxLogItemMockData = ({
  amountCents = 0,
  purchaseAmount = 0,
  surchargeAmount = 0,
  bankCashAmount = 0,
  tipAmount = 0,
  hostResponseText = 'Approved',
  successState = 'Success',
  type = 'type',
  transactionType = TransactionType.Purchase,
  completedTime = Date.now(),
  receipt = 'receipt',
  tid = 'tid',
  mid = 'mid',
  posId = 'posId',
  posRefId = 'posRefId',
  override = false,
  source = 'Integrated',
  total = 0,
  preAuthAmount = 0,
  topupAmount = 0,
  reduceAmount = 0,
  preAuthId = 'preAuthId',
}: {
  amountCents?: number;
  purchaseAmount?: number;
  surchargeAmount?: number;
  bankCashAmount?: number;
  tipAmount?: number;
  hostResponseText?: string;
  successState?: string;
  type?: string;
  transactionType?: string;
  completedTime?: number;
  receipt?: string;
  tid?: string;
  mid?: string;
  posId?: string;
  posRefId?: string;
  override?: boolean;
  source?: 'Integrated' | 'Pay At Table';
  total?: number;
  preAuthAmount?: number;
  topupAmount?: number;
  reduceAmount?: number;
  preAuthId?: string;
}): TxLogItem => ({
  completedTime,
  mid,
  posId,
  posRefId,
  receipt,
  successState,
  tid,
  type,
  override,
  amountCents,
  purchaseAmount,
  surchargeAmount,
  bankCashAmount,
  tipAmount,
  preAuthAmount,
  topupAmount,
  reduceAmount,
  preAuthId,
  hostResponseText,
  transactionType,
  total,
  source,
});

export const generateTxFlowMockData = ({
  success,
  purchaseAmount,
  preAuthAmount = 0,
  reduceAmount = 0,
  topupAmount = 0,
  tipAmount = 0,
  bankCashAmount = 0,
  surchargeAmount = 0,
  refundAmount = 0,
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
  refundAmount?: number;
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
      refundAmount: override ? 0 : refundAmount,
      preAuthId: '',
      success: true,
    },
  },
  override,
});
