export interface ITerminalProps {
  acquirerCode: string;
  autoAddress: boolean;
  deviceAddress: string;
  posId: string;
  secureWebSocket: boolean;
  serialNumber: string;
  testMode: boolean;
  pluginVersion: string;
  merchantId: string;
  terminalId: string;
  batteryLevel: string;
  flow: string | null;
  id: string;
  pairingFlow: IPairingFlow | null;
  secrets: ISecrets | null;
  settings: ISettings | null;
  status: string;
  terminalStatus: string | null;
  txFlow: ITxFlow | null;
  txMessage: ITxMessage | null;
}

export interface ITerminalState {
  [key: string]: ITerminalProps;
}

export interface ITerminalConfig {
  acquirerCode: string;
  autoAddress: boolean;
  deviceAddress: string;
  posId: string;
  secureWebSocket: boolean;
  serialNumber: string;
  testMode: boolean;
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
  Message: string;
  AwaitingCheckFromEftpos: boolean;
  AwaitingCheckFromPos: boolean;
  ConfirmationCode: string;
  Finished: boolean;
  Successful: boolean;
}
export interface ISecrets {
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
  pairFormValues: {
    acquirerCode: string;
    autoAddress: boolean;
    deviceAddress: string;
    posId: string;
    serialNumber: string;
    secrets: ISecrets | null;
    testMode: boolean;
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

export interface IUpdateTerminalAction {
  id: string;
  spiClient: ITerminalProps;
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
  secrets: ISecrets;
}
export interface IClearTransactionAction {
  id: string;
}
export interface IUpdateTxFlowAction {
  id: string;
  txFlow: ITxFlow | null;
}
export interface IUpdateSettingAction {
  id: string;
  settings: ISettings;
}
export interface IUpdateTxMessage {
  id: string;
  txMessage: ITxMessage;
}
