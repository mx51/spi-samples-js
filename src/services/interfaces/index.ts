export interface ITerminal {
  spiPreAuth: any;
  autoAddressResolutionFailed: Any;
  acquirerCode: string;
  autoAddress: boolean;
  deviceAddress: string;
  posId: string;
  secureWebSocket: boolean;
  serialNumber: string;
  testMode: boolean;
  currentTxFlowStateOverride: Any | null;
  CurrentTxFlowState: Any;
  check_sig_eftpos: boolean;
  options: Any;
  print_merchant_copy_input: boolean;
  receipt_from_eftpos: boolean;
  secrets: Any;
  status: string;
  spiClient: Any;
  spi_receipt_header: string;
  spi_receipt_footer: string;
  use_secure_web_sockets: boolean;
  addEventListener: Any;
  removeEventListener: Any;
  setEventMapper: Any;
}

export interface ITerminals {
  [instanceId: string]: ITerminal;
}
