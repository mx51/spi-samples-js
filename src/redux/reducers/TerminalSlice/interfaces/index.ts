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
  response: {
    data: {
      rrn: string;
      schemeAppName: string;
      schemeName: string;
      merchantReceipt: string;
      transactionType: string;
      hostResponseText: string;
    };
  };
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
  txFlow: ITxFlowRawProps;
}

export interface ITxFlowRawProps {
  PosRefId: string;
  Id: string;
  Type: string;
  DisplayMessage: string;
  AwaitingSignatureCheck: boolean;
  Finished: boolean;
  Success: string;
  Response: {
    Data: {
      rrn: string;
      scheme_app_name: string;
      scheme_name: string;
      merchant_receipt: string;
      transaction_Type: string;
      host_response_text: string;
    };
  };
  SignatureRequiredMessage: string | null;
  Request: {
    Id: string;
    EventName: string;
    Data: {
      pos_ref_id: string;
      purchase_amount: number;
      tip_amount: number;
      cash_amount: number;
      prompt_for_cashout: boolean;
      surcharge_amount: number;
    };

    posId: string;
    decryptedJson: string;
  };
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
  responseData: ITerminalReceiptRawProps;
}

export interface ITerminalReceiptRawProps {
  accumulated_settle_by_acquirer_count: string;
  accumulated_settle_by_acquirer_value: string;
  accumulated_total_count: string;
  accumulated_total_value: string;
  bank_date: string;
  bank_time: string;
  error_detail: string;
  error_reason: string;
  host_response_code: string;
  host_response_text: string;
  merchant_acquirer: string;
  merchant_address: string;
  merchant_city: string;
  merchant_country: string;
  merchant_name: string;
  merchant_postcode: string;
  merchant_receipt: string;
  merchant_receipt_printed: boolean;
  schemes: Array<IReceiptSchemes>;
  settlement_period_end_date: string;
  settlement_period_end_time: string;
  settlement_period_start_date: string;
  settlement_period_start_time: string;
  settlement_triggered_date: string;
  settlement_triggered_time: string;
  stan: string;
  success: boolean;
  terminal_id: string;
  transaction_range: string;
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
