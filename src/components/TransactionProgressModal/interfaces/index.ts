export interface TransactionProgressModalProps {
  terminalId: string;
  transactionType: string;
  isFinished: boolean;
  isSuccess: boolean;
  onCancelTransaction: () => void;
  onDone: () => void;
}
