import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import {
  SPI_PAIR_STATUS,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
} from '../../definitions/constants/commonConfigs';
import { defaultAAR, defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';
import ReduxProvider from '../../redux/ReduxProvider';
import { store } from '../../redux/store';
import { ITerminal } from '../../services/interfaces';

export const mockSerialNumber = '222-222-222';

export const mockTerminalInstanceId = '123-123-123';

export const defaultEmptyMockPairFormParams = {
  acquirerCode: {
    value: '',
    option: TEXT_FORM_DEFAULT_VALUE,
    isValid: true,
  },
  addressType: TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  deviceAddress: {
    value: '',
    isValid: true,
  },
  posId: {
    value: '',
    isValid: true,
  },
  serialNumber: {
    value: '',
    isValid: true,
  },
  testMode: true,
};

export const defaultMockPairFormParams = {
  acquirerCode: {
    value: 'test',
    option: TEXT_FORM_DEFAULT_VALUE,
    isValid: true,
  },
  addressType: TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  deviceAddress: {
    value: defaultLocalIP,
    isValid: true,
  },
  posId: {
    value: 'test',
    isValid: true,
  },
  serialNumber: {
    value: mockTerminalInstanceId,
    isValid: true,
  },
  testMode: true,
};

export const customMockPairFormParamsState = (
  acquirerCode = {
    value: '',
    option: TEXT_FORM_DEFAULT_VALUE,
    isValid: true,
  },
  addressType = TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  deviceAddress = {
    value: '',
    isValid: true,
  },
  posId = {
    value: '',
    isValid: true,
  },
  serialNumber = {
    value: '',
    isValid: true,
  },
  testMode = true
): IPairFormParams => ({
  acquirerCode,
  addressType,
  deviceAddress,
  posId,
  serialNumber,
  testMode,
});

export const mockDefaultProducts = {
  surchargeAmount: 100,
  tipAmount: 100,
  cashoutAmount: 100,
  products: [
    { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
    { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
  ],
};

export const defaultMockTerminals = {
  [mockTerminalInstanceId]: {
    acquirerCode: 'test',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'test',
    secureWebSocket: true,
    serialNumber: mockTerminalInstanceId,
    testMode: true,
    pluginVersion: '-',
    merchantId: '-',
    terminalId: '-',
    batteryLevel: '-',
    flow: null,
    id: '',
    pairingFlow: null,
    posVersion: null,
    secrets: null,
    settings: null, // not available during pair terminal stage
    status: SPI_PAIR_STATUS.Unpaired,
    terminalStatus: '',
    txFlow: null,
    txMessage: null, // not available during pair terminal stage
  },
};

export const mockPairingFlow = {
  Message: 'Requesting to Pair...',
  AwaitingCheckFromEftpos: false,
  AwaitingCheckFromPos: false,
  ConfirmationCode: '',
  Finished: false,
  Successful: false,
};

export const defaultTerminalFlow = {
  [mockTerminalInstanceId]: {
    status: SPI_PAIR_STATUS.Unpaired,
    pairingFlow: {
      Message: 'Requesting to Pair...',
      AwaitingCheckFromEftpos: false,
      AwaitingCheckFromPos: false,
      ConfirmationCode: '',
      Finished: false,
      Successful: false,
    },
    terminalConfig: {
      deviceAddress: defaultAAR,
    },
  },
};

export const defaultEFTPOSBasedPairFormParams = {
  acquirerCode: 'test',
  addressType: 'eftpos',
  deviceAddress: defaultLocalIP,
  posId: 'test',
  serialNumber: mockSerialNumber,
  testMode: false,
  aar: '',
};

export const defaultCodeBasedPairFormParams = {
  acquirerCode: TEXT_FORM_DEFAULT_VALUE,
  addressType: 'eftpos',
  deviceAddress: defaultLocalIP,
  posId: 'test',
  serialNumber: mockTerminalInstanceId,
  testMode: false,
  aar: '',
};

export const defaultAARBasedPairFormParams = {
  acquirerCode: '',
  addressType: 'auto',
  deviceAddress: defaultAAR,
  posId: '',
  serialNumber: '',
  testMode: false,
  aar: '',
};

export const mockSpiClient = {
  Config: {
    EnabledPrintMerchantCopy: false,
    EnabledPromptForCustomerCopyOnEftpos: false,
    EnabledSignatureFlowOnEftpos: false,
    PrintMerchantCopy: false,
    PromptForCustomerCopyOnEftpos: false,
    SignatureFlowOnEftpos: false,
  },
  CurrentDeviceStatus: null,
  CurrentFlow: null,
  CurrentPairingFlowState: null,
  CurrentTxFlowState: null,
  _acquirerCode: 'test',
  _autoAddressResolutionEnabled: true,
  _checkOnTxFrequency: 20000,
  _serialNumber: mockTerminalInstanceId,
  _conn: {
    Address: defaultAAR,
    Connected: false,
    SpiProtocol: '1.1.1',
    State: SPI_PAIR_STATUS.Unpaired,
    _conectionTimeout: null,
    _deviceApiKey: 'test',
    _eftposAddress: defaultAAR,
    _maxSecretsRetryAttempts: 4,
    _maxWaitForCancelTx: 10000,
    _missedPongsCount: 0,
    _missedPongsToDisconnect: 2,
    _mostRecentLoginResponse: null,
    _mostRecentPingSent: null,
    _mostRecentPongReceived: null,
    _periodicPingThread: null,
    _pingFrequency: 18000,
    _pongTimeout: 5000,
    _posId: 'test',
    _posVendorId: 'mx51',
    _posVersion: '1.1.1',
    _previousSecrets: null,
  },
  _testMode: true,
  _mostRecentPongReceived: true,
  GetTerminalStatus: () => defaultAAR,
  SetEventBus: (instance: Any) => {},
  BatteryLevelChanged: jest.fn(),
};

export const mockTerminalInstance: ITerminal = {
  addEventListener: jest.fn(),
  currentTxFlowStateOverride: null,
  removeEventListener: jest.fn(),
  setEventMapper: jest.fn(),
  spiClient: mockSpiClient,
  autoAddressResolutionFailed: jest.fn(),
  acquirerCode: 'test',
  autoAddress: false,
  deviceAddress: defaultLocalIP,
  posId: 'test',
  secureWebSocket: true,
  serialNumber: mockTerminalInstanceId,
  testMode: true,
  CurrentTxFlowState: null,
  check_sig_eftpos: false,
  options: {},
  print_merchant_copy_input: false,
  receipt_from_eftpos: false,
  secrets: null,
  status: SPI_PAIR_STATUS.Unpaired,
  spi_receipt_header: 'test',
  spi_receipt_footer: 'test',
  use_secure_web_sockets: false,
};

// mock container with redux provider
export default (children: React.ReactNode, customizedStore?: Any): Any => {
  const { container } = render(
    <ReduxProvider reduxStore={customizedStore || store}>
      <Router>{children}</Router>
    </ReduxProvider>
  );

  return container;
};

// mock terminals configurations
export function mockTerminalsConfigs(updates: Any): ITerminalState {
  return {
    ...defaultMockTerminals,
    [mockTerminalInstanceId]: {
      ...defaultMockTerminals[mockTerminalInstanceId],
      ...updates,
    },
  };
}