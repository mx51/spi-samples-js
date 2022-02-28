import { SpiStatus, TransactionType } from '@mx51/spi-client-js';
// configuration types
export const TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE = 'auto';
export const TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE = 'eftpos';
// payment provider codes
export const TEXT_FORM_DEFAULT_OPTION = 'Payment provider';
export const TEXT_FORM_DEFAULT_VALUE = '(Other) Please specify';
export const TEXT_FORM_MODAL_CODE_TILL = 'till';
export const TEXT_FORM_MODAL_CODE_WESTPAC = 'wbc';
export const TEXT_FORM_MODAL_CODE_GKO = 'gko';
// form validations
export const TEXT_FORM_VALIDATION_API_KEY_TEXTFIELD = 'Please enter an API Key.';
export const TEXT_FORM_VALIDATION_POS_ID_TEXTFIELD =
  'Please enter a valid POS ID (max 16 character long including numbers or alphabets)';
export const TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD = 'Please enter a supported provider.';
export const TEXT_FORM_VALIDATION_SERIAL_NUMBER_TEXTFIELD = 'Please enter a 9 digits Serial number.';
export const TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD = 'Please enter a valid EFTPOS address.';

export const SPI_PAIR_STATUS = {
  PairedConnected: SpiStatus.PairedConnected,
  PairedConnecting: SpiStatus.PairedConnecting,
  Unpaired: SpiStatus.Unpaired,
};
export const SPI_TRANSACTION_TYPES = {
  AccountVerify: TransactionType.AccountVerify,
  CashoutOnly: TransactionType.CashoutOnly,
  GetTransaction: TransactionType.GetTransaction,
  GetLastTransaction: TransactionType.GetLastTransaction,
  MOTO: TransactionType.MOTO,
  Preauth: TransactionType.Preauth,
  Purchase: TransactionType.Purchase,
  Refund: TransactionType.Refund,
  Reversal: TransactionType.Reversal,
  Settle: TransactionType.Settle,
  SettlementEnquiry: TransactionType.SettlementEnquiry,
  ZipPurchase: TransactionType.ZipPurchase,
  ZipRefund: TransactionType.ZipRefund,
};
// pair flow drawer width 4/12 (based on design required)
export const drawerWidth = 33.33333;
// spi service constants
export const spiEvents = {
  spiAutoAddressResolutionFailed: 'AutoAddressResolutionFailed',
  spiBatteryLevelChanged: 'BatteryLevelChanged',
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
  TerminalStatusResponse: 'terminal_status',
};

export const commonPairErrorMessage = 'Unable to pair. Please check your configuration details and try again.';
