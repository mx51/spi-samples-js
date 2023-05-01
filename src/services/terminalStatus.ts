import {
  Spi,
  PrintingResponse,
  TerminalConfigurationResponse,
  TerminalStatusResponse,
  TerminalBattery,
  TransactionUpdate,
  SuccessState,
  SpiFlow,
} from '@mx51/spi-client-js';
import Pos from './_common/pos';

function onTxFlowStateChanged(flowMsg: Logger, printStatusAndActions: Function) {
  flowMsg.Clear();
  printStatusAndActions();
  flowMsg.Info('> ');
}

function onPairingFlowStateChanged(flowMsg: Logger, printStatusAndActions: Function) {
  flowMsg.Clear();
  printStatusAndActions();
  flowMsg.Info('> ');
}

function onSecretsChanged(log: Console, secrets: Secrets) {
  if (secrets != null) {
    log.info(`# I Have Secrets: ${secrets.EncKey}${secrets.HmacKey}. Persist them Securely.`);
    localStorage.setItem('EncKey', secrets.EncKey);
    localStorage.setItem('HmacKey', secrets.HmacKey);
  } else {
    log.info(`# I Have Lost the Secrets, i.e. Unpaired. Destroy the persisted secrets.`);
    localStorage.removeItem('EncKey');
    localStorage.removeItem('HmacKey');
  }
}

function onSpiStatusChanged(flowMsg: Logger, printStatusAndActions: Function, spiStatus: string) {
  flowMsg.Clear();
  flowMsg.Info(`# --> SPI Status Changed: ${spiStatus}`);
  printStatusAndActions();
}

function handlePrintingResponse(flowMsg: Logger, spi: Spi, message: Message, printStatusAndActions: Function) {
  flowMsg.Clear();
  const printingResponse = new PrintingResponse(message);

  if (printingResponse.isSuccess()) {
    flowMsg.Info('# --> Printing Response: Printing Receipt successful');
  } else {
    flowMsg.Info(
      `# --> Printing Response:  Printing Receipt failed: reason = ${printingResponse.getErrorReason()}, detail = ${printingResponse.getErrorDetail()}`
    );
  }

  spi.AckFlowEndedAndBackToIdle();
  printStatusAndActions();
}

function handleTerminalConfigurationResponse(flowMsg: Logger, message: Message) {
  const terminalConfigResponse = new TerminalConfigurationResponse(message);
  if (terminalConfigResponse.isSuccess()) {
    flowMsg.Info('# Terminal Configuration Response #');
    flowMsg.Info(`# Comms Method: ${terminalConfigResponse.GetCommsSelected()}`);
    flowMsg.Info(`# MerchantId: ${terminalConfigResponse.GetMerchantId()}`);
    flowMsg.Info(`# PA Version: ${terminalConfigResponse.GetPAVersion()}`);
    flowMsg.Info(`# Payment Interface Version: ${terminalConfigResponse.GetPaymentInterfaceVersion()}`);
    flowMsg.Info(`# Plugin Version: ${terminalConfigResponse.GetPluginVersion()}`);
    flowMsg.Info(`# Serial Number: ${terminalConfigResponse.GetSerialNumber()}`);
    flowMsg.Info(`# TerminalId: ${terminalConfigResponse.GetTerminalId()}`);
    flowMsg.Info(`# Terminal Model: ${terminalConfigResponse.GetTerminalModel()}`);
  }
}

function handleTerminalStatusResponse(flowMsg: Logger, spi: Spi, message: Message, printStatusAndActions: Function) {
  flowMsg.Clear();
  const terminalStatusResponse = new TerminalStatusResponse(message);
  flowMsg.Info('# Terminal Status Response #');
  flowMsg.Info(`# Status: ${terminalStatusResponse.GetStatus()}`);
  flowMsg.Info(`# Battery Level: ${terminalStatusResponse.GetBatteryLevel()}%`);
  flowMsg.Info(`# Charging: ${terminalStatusResponse.IsCharging()}`);
  spi.AckFlowEndedAndBackToIdle();
  printStatusAndActions();
}

function handleTransactionUpdateMessage(flowMsg: Logger, message: Message) {
  const txnUpdateMessage = new TransactionUpdate(message);
  flowMsg.Info(`${txnUpdateMessage.GetDisplayMessageText()}`);
}

function handleBatteryLevelChanged(
  flowMsg: Logger,
  log: Console,
  spi: Spi,
  message: Message,
  printStatusAndActions: Function
) {
  log.clear();
  const terminalBattery = new TerminalBattery(message);
  flowMsg.Info('# Battery Level Changed #');
  flowMsg.Info(`# Battery Level: ${terminalBattery.BatteryLevel}%`);
  spi.AckFlowEndedAndBackToIdle();
  printStatusAndActions();
}

function isUnknownStatus(spi: Spi) {
  if (spi.CurrentFlow === SpiFlow.Transaction) {
    if (spi.CurrentTxFlowState.Finished && spi.CurrentTxFlowState.Success === SuccessState.Unknown) {
      return true;
    }
  }

  return false;
}

function printPairingStatus(flowMsg: Logger, posId: string, eftposAddress: string, spi: Spi, version: string) {
  flowMsg.Info(`# --------------- STATUS ------------------`);
  flowMsg.Info(`# ${posId} <-> Eftpos: ${eftposAddress} #`);
  flowMsg.Info(`# SPI STATUS: ${spi.CurrentStatus}     FLOW: ${spi.CurrentFlow} #`);
  flowMsg.Info(`# SPI CONFIG: ${JSON.stringify(spi.Config)}`);
  flowMsg.Info(`# -----------------------------------------`);
  flowMsg.Info(`# POS: v${version} Spi: v${Spi.GetVersion()}`);
}

function setAutoAddressResolutionState(
  spi: Spi,
  autoResolveEftposAddress: boolean,
  testMode: boolean,
  useSecureWebSockets: boolean
) {
  spi.SetTestMode(testMode);
  spi.SetSecureWebSockets(useSecureWebSockets);
  spi.SetAutoAddressResolution(autoResolveEftposAddress);
}

function setIsMerchantReceiptPrinted(
  flowMsg: Logger,
  spi: Spi,
  isMerchantReceiptPrinted: boolean,
  printStatusAndActions: Function
) {
  // eslint-disable-next-line no-param-reassign
  spi.Config.PrintMerchantCopy = isMerchantReceiptPrinted;
  spi.AckFlowEndedAndBackToIdle();

  flowMsg.Clear();
  printStatusAndActions();
}

function setCustomReceiptStrings(
  flowMsg: Logger,
  options: Options,
  spi: Spi,
  printStatusAndActions: Function,
  customerReceiptHeader: string,
  customerReceiptFooter: string,
  merchantReceiptHeader: string,
  merchantReceiptFooter: string
) {
  flowMsg.Clear();

  options.SetCustomerReceiptHeader(Pos.sanitizePrintText(customerReceiptHeader));
  options.SetCustomerReceiptFooter(Pos.sanitizePrintText(customerReceiptFooter));
  options.SetMerchantReceiptHeader(Pos.sanitizePrintText(merchantReceiptHeader));
  options.SetMerchantReceiptFooter(Pos.sanitizePrintText(merchantReceiptFooter));
  spi.AckFlowEndedAndBackToIdle();

  flowMsg.Info('Receipt header / footer updated.');
  printStatusAndActions();
}

function getTerminalStatus(spi: Spi) {
  spi.GetTerminalStatus();
}

export default {
  getTerminalStatus,
  handleBatteryLevelChanged,
  handlePrintingResponse,
  handleTerminalConfigurationResponse,
  handleTerminalStatusResponse,
  handleTransactionUpdateMessage,
  isUnknownStatus,
  onPairingFlowStateChanged,
  onSecretsChanged,
  onSpiStatusChanged,
  onTxFlowStateChanged,
  printPairingStatus,
  setAutoAddressResolutionState,
  setCustomReceiptStrings,
  setIsMerchantReceiptPrinted,
};
