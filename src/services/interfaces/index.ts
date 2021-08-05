interface ITerminalSettings {
  currentTxFlowStateOverride?: Any;
  CurrentTxFlowState?: Any;
  check_sig_eftpos?: boolean;
  options?: Any;
  print_merchant_copy_input?: boolean;
  receipt_from_eftpos?: boolean;
  secrets?: Any;
  spiClient?: Any;
  spi_receipt_header?: string;
  spi_receipt_footer?: string;
  use_secure_web_sockets?: boolean;
}

export interface ITerminalConfig extends ITerminalSettings {
  acquirerCode?: string;
  apiKey?: string;
  autoAddress?: boolean;
  eftpos?: string;
  posId?: string;
  secureWebSocket?: boolean;
  serialNumber?: string;
  testMode?: boolean;
}

export interface ITerminals {
  [instanceId: string]: ITerminalConfig;
}
