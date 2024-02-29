export interface TransactionProgressModalProps {
  terminalId: string;
  transactionType: string;
  transactionDesc: string;
  isFinished: boolean;
  isSuccess: boolean;
  onCancelTransaction: () => void;
  onDone: () => void;
  onRetryTransaction: () => void;
}
