import React from 'react';
import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';

export interface IReceiptToggles {
  settlement: boolean;
  settlementEnquiry: boolean;
}

export interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  subtitle: string;
  title: string;
  value: number;
  receiptToggle?: IReceiptToggles;
  terminal?: ITerminalProps | null;
}

export interface ITerminalConfigurationConstants {
  title: string;
  content: string;
}

export interface IAboutTerminal {
  receiptToggle: IReceiptToggles;
  setReceiptToggle: (receiptToggle: IReceiptToggles) => void;
  terminal: ITerminalProps;
}
