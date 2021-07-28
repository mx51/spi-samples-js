export interface Terminal {
  posId: string;
  pairingStatus: PairingStatus;
  eftposAddress: string;
  serialNumber: string;
}
export interface ITerminals {
  terminals: Array<Terminal>;
}

export enum PairingStatus {
  Connecting,
  Connected,
  Disconnected,
  Idle,
}
