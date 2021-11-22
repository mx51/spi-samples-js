export interface PairPanelButtonsInterface {
  statusTitle: string;
  statusIcon: React.ReactNode;
  statusText: string;
  button: React.ReactNode;
}

export interface IPairPanelInformation {
  title: string;
  content: string | undefined;
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
