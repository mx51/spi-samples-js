export interface ITerminalRecord {
  posId: string;
  pairingStatus: PairingStatus;
  deviceAddress: string;
  serialNumber: string;
  status: string;
}
export interface ITerminalsRecords {
  terminals: Array<ITerminalRecord>;
}

export enum PairingStatus {
  Connecting,
  Connected,
  Disconnected,
  Idle,
}
