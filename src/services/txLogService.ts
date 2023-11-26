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
  amount: number;
}

export class TxLogService {
  static saveAndDeleteYesterdayTx(txLogItem: TxLogItem): void {
    const savedTxLog = TxLogService.load();
    localStorage.setItem(
      TX_LOG_KEY,
      JSON.stringify([...savedTxLog, txLogItem].filter((tx) => dayjs(tx.completedTime).date() >= dayjs().date()))
    );
  }

  static load(): TxLogItem[] {
    return JSON.parse(localStorage.getItem(TX_LOG_KEY) ?? '[]') as TxLogItem[];
  }
}
