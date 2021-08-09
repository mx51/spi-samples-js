import { SpiFlow, SpiStatus } from '@mx51/spi-client-js';
// configuration types
export const TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE = 'auto';
export const TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE = 'eftpos';
// payment provider codes
export const TEXT_FORM_MODAL_CODE_TILL = 'till';
export const TEXT_FORM_MODAL_CODE_WESTPAC = 'wbc';
// form validations
export const TEXT_FORM_VALIDATION_API_KEY_TEXTFIELD = 'Please enter an API Key.';
export const TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD = 'Please enter a POS ID.';
export const TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD = 'Please enter a supported provider.';
export const TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD = 'Please enter a 9 digits Serial number.';
// pair status text
export const SPI_PAIR_FLOW = {
  IDLE: SpiFlow.Idle,
  PAIRING: SpiFlow.Pairing,
  TRANSACTION: SpiFlow.Transaction,
};
export const SPI_PAIR_STATUS = {
  CONNECTED: SpiStatus.PairedConnected,
  CONNECTING: SpiStatus.PairedConnecting,
  UNPAIRED: SpiStatus.Unpaired,
};
// pair flow drawer width 4/12 (based on design required)
export const drawerWidth = 33.33333;
// spi service constants
export const spiEvents = {
  spiCallAcceptSignature: 'spiCallAcceptSignature',
  spiCallAckFlowEnd: 'spiCallAckFlowEnd',
  spiCallCancelTx: 'spiCallCancelTx',
  spiCallGetTerminalConfig: 'spiCallGetTerminalConfig',
  spiCallGetTerminalStatus: 'spiCallGetTerminalStatus',
  spiCallInitiateTx: 'spiCallInitiateTx',
  spiCallPair: 'spiCallPair',
  spiCallPairingCancel: 'spiCallPairingCancel',
  spiCallPairingConfirmCode: 'spiCallPairingConfirmCode',
  spiCallSetConfig: 'spiCallSetConfig',
  spiCallUnpair: 'spiCallUnpair',

  spiAutoAddressResolutionFailed: 'AutoAddressResolutionFailed',
  spiDeviceAddressChanged: 'DeviceAddressChanged',
  spiSecretsChanged: 'SecretsChanged',
  spiFlowChanged: 'spiFlowChanged',
  spiPairingFlowStateChanged: 'PairingFlowStateChanged',
  spiPong: 'SpiPong',
  spiStatusChanged: 'StatusChanged',
  spiTerminalSetupsChanged: 'TerminalConfigChanged',
  spiTerminalStatusChanged: 'TerminalStatusChanged',
  spiTxFlowStateChanged: 'TxFlowStateChanged',
  spiTxUpdateMessage: 'TransactionUpdateMessage',
};
