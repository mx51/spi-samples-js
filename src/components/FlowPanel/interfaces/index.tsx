import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';

export interface IFlowPanel {
  flow: boolean;
  receiptToggle?: boolean;
}

export interface IFlowPanelState {
  flow: boolean;
  terminal?: ITerminalProps | null;
}
