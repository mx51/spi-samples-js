export interface ITerminalState {
  [key: string]: {
    id: string;
    status: string | null;
    terminalStatus: string | null;
    flow: string | null;
    txFlow: ITxFlow | null;
    pairingFlow: IPairingFlow;
    terminalConfig: ITerminalConfig | Record<string, unknown>;
    secret: ISecret | null;
    txMessage: ITxMessage | null;
    settings: ISettings | null;
  };
}
// Types for common interfaces
export interface ITerminalConfig {
  posId: string;
  deviceAddress: string;
  autoAddress: boolean;
  serialNumber: string;
  testMode: boolean;
  secureWebSocket: boolean;
  apiKey: string;
}
export interface ISettings {
  eftposReceipt: boolean;
  sigFlow: boolean;
  printMerchantCopy: boolean;
  suppressMerchantPassword: boolean;
  receiptHeader: string | null;
  receiptFooter: string | null;
}
export interface ITxFlow {
  posRefId: string;
  id: string;
  type: string;
  displayMessage: string;
  amountCents: number;
  awaitingSignatureCheck: boolean;
  finished: boolean;
  success: string;
  response: string | null;
  signatureRequiredMessage: string | null;
  request: {
    id: string;
    eventName: string;
    data: {
      posRefId: string;
      purchaseAmount: number;
      tipAmount: number;
      cashAmount: number;
      promptForCashout: boolean;
      surchargeAmount: number;
      promptForCustomerCopy: boolean;
      printForSignatureRequiredTransactions: boolean;
      printMerchantCopy: boolean;
      customerReceiptHeader: string;
      customerReceiptFooter: string;
      merchantReceiptHeader: string;
      merchantReceiptFooter: string;
    };
    posId: string;
    decryptedJson: string;
  };
}
export interface IPairingFlow {
  message: string;
  awaitingCheckFromEftpos: boolean;
  awaitingCheckFromPos: boolean;
  confirmationCode: string;
  finished: boolean;
  successful: boolean;
}
export interface ISecret {
  encKey: string;
  hmacKey: string;
}
export interface ITxMessage {
  displayMessageCode: number;
  displayMessageText: string;
  posRefId: string;
  posCounter: string;
  decryptedJson: string;
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
  deviceAddress: string;
}
export interface IUpdatePairingFlowAction {
  id: string;
  pairingFlow: IPairingFlow;
}
export interface IUpdatePairingStatusAction {
  id: string;
  status: string;
}
export interface IRemoveTerminalAction {
  id: string;
}
export interface IUpdateTerminalSerialNumberAction {
  id: string;
  serialNumber: string;
}
export interface IUpdateTerminalSecretAction {
  id: string;
  secret: ISecret;
}
export interface IClearTransactionAction {
  id: string;
}
export interface IUpdateTxFlowAction {
  id: string;
  txFlow: ITxFlow;
}
export interface IUpdateSettingAction {
  id: string;
  settings: ISettings;
}
export interface IUpdateTxMessage {
  id: string;
  txMessage: ITxMessage;
}
