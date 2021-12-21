export interface IOrderConfirmation {
  title: string;
  pathname: string;
  currentAmount: number;
}

export interface ITitleStrategy {
  Pay: string;
  Cashout: string;
  Refund: string;
}
