export interface SpiCloudPairing {
  posNickname: string;
  hexCode: string;
  tid: string;
  tenant: string;
  environment: string;
  pairingId: string;
  keyId: string;
  signingSecret: string;
  spiCloudApiBaseUrl: string;
}

export interface SpiCloudPairingState {
  [key: string]: SpiCloudPairing;
}
