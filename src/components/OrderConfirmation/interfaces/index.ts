import { TransactionHandler } from '../../../transaction-handling/transaction-handler';

export interface IOrderConfirmation {
  title: string;
  pathname: string;
  editSubtotal: boolean;
}

export interface ITitleStrategy {
  Pay: string;
  Cashout: string;
  Refund: string;
}

export interface IProps {
  setShowTransactionProgressModal: (show: boolean) => void;
  transactionHandler?: TransactionHandler<unknown>;
}
