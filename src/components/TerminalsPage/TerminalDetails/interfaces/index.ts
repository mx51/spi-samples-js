import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';

export interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  subtitle: string;
  title: string;
  value: number;
  receiptToggle?: boolean;
  terminal: ITerminalProps | null;
}

export interface ITerminalConfigurationConstants {
  title: string;
  content: string;
}

export interface IAboutTerminal {
  receiptToggle: boolean;
  setReceiptToggle: (receiptToggle: boolean) => void;
  terminal: ITerminalProps;
}
