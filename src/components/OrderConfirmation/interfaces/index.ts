export interface IOrderConfirmation {
  title: string;
  pathname: string;
  currentAmount: number;
  editSubtotal: boolean;
}

export interface ITitleStrategy {
  Pay: string;
  Cashout: string;
  Refund: string;
}

export interface IProps {
  isDisabled: () => boolean;
  totalAmount: number;
  setShowTransactionProgressModal: (show: boolean) => void;
}
