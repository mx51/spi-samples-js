import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';

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
  selectedTerminal?: ITerminalProps;
}
