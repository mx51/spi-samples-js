import { IPairFormSettings } from '../../components/PairPage/PairForm/interfaces';

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
  addEventListener?: Any;
  dispatchEvent?: Any;
  removeEventListener?: Any;
  setEventMapper?: Any;
}

export interface ITerminalSetups extends IPairFormSettings, ITerminalSettings {}

export interface ITerminals {
  [instanceId: string]: ITerminalSetups;
}
