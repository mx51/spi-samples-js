export interface PairPanelButtonsInterface {
  statusTitle: string;
  statusIcon: React.ReactNode;
  statusText: string;
  button: React.ReactNode;
}

export interface PairPanelInformationInterface {
  title: string;
  content: string;
}

export interface PairStatusInterface {
  open: boolean;
  handleDrawerToggle: () => void;
}

export interface PairStatusStatesInterface {
  merchantId: string;
  terminalId: string;
  battery: string;
}
