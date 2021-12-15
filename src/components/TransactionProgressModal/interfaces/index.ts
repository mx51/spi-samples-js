export interface TransactionProgressModalProps {
  transactionType: string;
  isFinished: boolean;
  isSuccess: boolean;
  onCancelTransaction: () => void;
  onDone: () => void;
}
