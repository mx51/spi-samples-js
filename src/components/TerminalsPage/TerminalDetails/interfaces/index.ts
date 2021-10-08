import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';

export interface TabPanelProps {
  children: React.ReactNode;
  flow: boolean;
  index: Any;
  setFlow: () => void;
  subtitle: string;
  title: string;
  value: Any;
  receiptToggle?: boolean;
  terminal: ITerminalProps | null;
}

export interface ITerminalConfigurationConstants {
  title: string;
  content: string;
}
