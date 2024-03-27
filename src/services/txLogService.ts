import dayjs from 'dayjs';
import { TransactionType } from '@mx51/spi-client-js';
import { ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';
import { getTxTypeByPosRefId } from '../utils/tx-utils';
import { calculateCashoutOnlyTotalAmount, calculateTotalAmount } from '../utils/common/helpers';

export const TX_LOG_KEY = 'TransactionLog';

export interface TxLogItem {
  completedTime: number;
  mid: string;
  posId: string;
  posRefId: string;
  receipt: string;
  successState: string;
  tid: string;
  type: string;
  override?: boolean;
  amountCents: number;
  purchaseAmount: number;
  surchargeAmount: number;
  bankCashAmount: number;
  tipAmount: number;
  preAuthAmount?: number;
  topupAmount?: number;
  reduceAmount?: number;
  preAuthId?: string;
  hostResponseText: string;
  transactionType: string;
  total: number;
  source: 'Integrated' | 'Pay At Table';
}

export class TxLogService {
  static saveAndDeleteYesterdayTx(txLogItem: TxLogItem): void {
    const savedTxLog = TxLogService.load();
    localStorage.setItem(
      TX_LOG_KEY,
      JSON.stringify([...savedTxLog, txLogItem].filter((tx) => dayjs(tx.completedTime).date() >= dayjs().date()))
    );
  }

  static updateTx(txLogItem: TxLogItem): void {
    const savedTxLog = TxLogService.load();
    localStorage.setItem(
      TX_LOG_KEY,
      JSON.stringify(
        savedTxLog.map((tx) => {
          if (tx.posRefId === txLogItem.posRefId) {
            return txLogItem;
          }
          return tx;
        })
      )
    );
  }

  static load(): TxLogItem[] {
    return JSON.parse(localStorage.getItem(TX_LOG_KEY) ?? '[]') as TxLogItem[];
  }

  static removeTx(posRefId: string): void {
    const savedTxLog = TxLogService.load();
    localStorage.setItem(TX_LOG_KEY, JSON.stringify(savedTxLog.filter((tx) => tx.posRefId !== posRefId)));
  }

  static findTxByPosRefId(posRefId: string): TxLogItem | undefined {
    return TxLogService.load().find((tx) => tx.posRefId === posRefId);
  }
}

export const TxLogServiceMapper = {
  toTxLogItem({ txFlow, posId, tid, mid }: { txFlow: ITxFlow; posId: string; tid: string; mid: string }): TxLogItem {
    const {
      request,
      response,
      success: successState,
      completedTime,
      type,
      posRefId,
      receipt: transactionReceipt,
      override,
    } = txFlow;
    const { preAuthId, hostResponseText, transactionType } = response.data;

    const { purchaseAmount, surchargeAmount, bankCashAmount, tipAmount, preAuthAmount, topupAmount, reduceAmount } =
      override ? request.data : response.data;

    const amountCents = txFlow.amountCents || purchaseAmount;

    // TODO: put this logic into a normalized calculate total
    // instead of splitting it out.
    const total =
      type === TransactionType.CashoutOnly
        ? calculateCashoutOnlyTotalAmount({
            amountCents,
            surchargeAmount,
            bankCashAmount,
            tipAmount,
          })
        : calculateTotalAmount({
            amountCents,
            surchargeAmount,
            bankCashAmount,
            tipAmount,
          });

    return {
      successState,
      completedTime,
      type: getTxTypeByPosRefId(posRefId),
      posRefId,
      posId,
      tid,
      mid,
      receipt: transactionReceipt,
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
      source: 'Integrated',
    };
  },
};
