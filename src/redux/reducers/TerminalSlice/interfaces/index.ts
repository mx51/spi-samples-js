export interface ITerminalProps {
  acquirerCode: string;
  autoAddress: boolean;
  deviceAddress: string;
  posId: string;
  secureWebSocket: boolean;
  serialNumber: string;
  testMode: boolean;
  pluginVersion?: string;
  posVersion?: string;
  merchantId?: string;
  terminalId?: string;
  batteryLevel?: string;
  flow: string | null;
  id: string;
  pairingFlow: IPairingFlow | null;
  receipt?: ITerminalReceiptFormatProps;
  secrets: ISecrets | null;
  settings: ISettings | null;
  status: string;
  reconnecting: boolean;
  terminalStatus: string | null;
  txFlow: ITxFlow | null;
  txMessage: ITxMessage | null;
}

export interface ITerminalState {
  [key: string]: ITerminalProps;
}

export interface ITerminal {
  terminal?: ITerminalProps | null;
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
  signatureRequiredMessage: {
    posRefId: string | undefined;
    requestId: string | undefined;
    receiptToSign: string | undefined;
  } | null;
  request: {
    id: string;
    eventName: string;
    data: {
      posRefId: string;
      purchaseAmount: number;
      cashAmount: number;
      surchargeAmount: number;
      tipAmount: number;
      promptForCashout: boolean;
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
  response: {
    data: {
      rrn: string;
      schemeAppName: string;
      schemeName: string;
      merchantReceipt: string;
      transactionType: string;
      hostResponseText: string;
      purchaseAmount: number;
      bankCashAmount: number;
      surchargeAmount: number;
      tipAmount: number;
    };
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
  terminalConfigs: {
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
    flow: null;
    id: string;
    pairingFlow: null;
    posVersion: string;
    secrets: ISecrets | null;
    settings: null;
    status: string;
    terminalStatus: string;
    txFlow: null;
    txMessage: null;
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
  txFlow: ITxFlow;
}
export interface IUpdateSettingAction {
  id: string;
  settings: ISettings;
}

export interface IConfigurations {
  id: string;
  pluginVersion: string;
  merchantId: string;
  terminalId: string;
}

export interface IBatteryLevel {
  id: string;
  batteryLevel: string;
}

export interface IUpdateTxMessage {
  id: string;
  txMessage: ITxMessage;
}

export interface IUpdateTerminalReceipt {
  id: string;
  receipt: ITerminalReceiptFormatProps;
}

export interface ITerminalReceiptFormatProps {
  accumulatedSettleByAcquirerCount: string;
  accumulatedSettleByAcquirerValue: string;
  accumulatedTotalCount: string;
  accumulatedTotalValue: string;
  bankDate: string;
  bankTime: string;
  errorDetail: string;
  errorReason: string;
  hostResponseCode: string;
  hostResponseText: string;
  merchantAcquirer: string;
  merchantAddress: string;
  merchantCity: string;
  merchantCountry: string;
  merchantName: string;
  merchantPostcode: string;
  merchantReceipt: string;
  merchantReceiptPrinted: boolean;
  schemes: Array<IReceiptSchemes>;
  settlementPeriodEndDate: string;
  settlementPeriodEndTime: string;
  settlementPeriodStartDate: string;
  settlementPeriodStartTime: string;
  settlementTriggeredDate: string;
  settlementTriggeredTime: string;
  stan: string;
  success: boolean;
  terminalId: string;
  transactionRange: string;
}

export interface IReceiptSchemes {
  scheme_name: string;
  settle_by_acquirer: string;
  total_count: string;
  total_value: string;
}
