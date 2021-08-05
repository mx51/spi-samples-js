export interface ITerminalState {
  [key: string]: {
    id: string;
    status: string | null;
    terminalStatus: string | null;
    flow: string | null;
    txFlow: null;
    pairingFlow: {
      message: string | null;
      awaitingCheckFromEftpos: boolean | null;
      awaitingCheckFromPos: boolean | null;
      confirmationCode: string | null;
      finished: boolean | null;
      successful: boolean | null;
    };
    terminalConfig: ITerminalConfig | Record<string, unknown>;
  };
}

// Types for common interfaces
export interface ITerminalConfig {
  posId: string;
  eftpos: string;
  autoAddress: boolean;
  serialNumber: string;
  testMode: boolean;
  secureWebSocket: boolean;
  apiKey: string;
}

// Types for Actions
export interface IAddTerminalAction {
  id: string;
  terminal: {
    status: string | null;
    terminalStatus: string | null;
    flow: string | null;
    txFlow: null;
    terminalConfig: ITerminalConfig | Record<string, unknown>;
  };
}

export interface IUpdateDeviceAddressAction {
  id: string;
  eftpos: string;
}

export interface IUpdatePairingFlowAction {
  id: string;
  pairingFlow: {
    message: string;
    awaitingCheckFromEftpos: boolean;
    awaitingCheckFromPos: boolean;
    confirmationCode: string;
    finished: boolean;
    successful: boolean;
  };
}

export interface IUpdatePairingStatusAction {
  id: string;
  status: string;
}

export interface IRemoveTerminalAction {
  id: string;
}
