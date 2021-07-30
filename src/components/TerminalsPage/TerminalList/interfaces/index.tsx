export interface ITerminal {
  posId: string;
  pairingStatus: PairingStatus;
  eftposAddress: string;
  serialNumber: string;
}
export interface ITerminals {
  terminals: Array<ITerminal>;
}

export enum PairingStatus {
  Connecting,
  Connected,
  Disconnected,
  Idle,
}
