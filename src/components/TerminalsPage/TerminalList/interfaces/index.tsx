import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';

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

export interface ITerminalList {
  terminals: Array<ITerminalProps>;
}

export enum PairingStatus {
  Connecting,
  Connected,
  Disconnected,
  Idle,
}
