export interface IPreAuthState {
  openPreAuths: Array<IPreAuthValues>;
  keyPadAmount: number;
}

export interface IPreAuthValues {
  preAuthRef: string;
  preAuthAmount: number;
  topupAmount: number;
  reduceAmount: number;
  surcharge: number;
  verified: boolean;
}

export interface IPreAuthAction {
  preAuth: IPreAuthValues;
}
