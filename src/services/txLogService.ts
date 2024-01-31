import dayjs from 'dayjs';

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
