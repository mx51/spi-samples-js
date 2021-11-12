import { cleanup } from '@testing-library/react';
import {
  defaultMockCommonState,
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockDefaultProducts,
  mockTerminalInstanceId,
} from '../../../utils/tests/common';
import {
  terminalList,
  terminalInstance,
  isTerminalUnpaired,
  pairedConnectedTerminalList,
} from './terminalsSliceSelectors';

const mockStoreState = {
  common: defaultMockCommonState,
  pairForm: defaultMockPairFormParams,
  products: mockDefaultProducts,
  terminals: defaultMockTerminals,
};

describe('Test terminals slice selectors', () => {
  afterEach(cleanup);

  test('Test terminalList', () => {
    // Assert
    expect(terminalList(mockStoreState)).toMatchObject(mockStoreState.terminals);
  });

  test('Test terminalInstance', () => {
    // Act
    const actualResult = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(terminalList(mockStoreState));

    // Assert
    expect(actualResult).toMatchObject(mockStoreState.terminals[mockTerminalInstanceId]);
  });

  test('Test isTerminalUnpaired', () => {
    // Act
    const actualResult = (isTerminalUnpaired(mockTerminalInstanceId) as Any).resultFunc(
      terminalInstance(mockTerminalInstanceId)
    );

    // Assert
    expect(actualResult).toBeFalsy();
  });

  test('should return terminal which are paired connected', () => {
    const state = {
      common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
      pair: { status: '' },
      products: {
        surchargeAmount: 0,
        tipAmount: 0,
        cashoutAmount: 0,
        products: [],
      },
      pairForm: {
        acquirerCode: {
          value: 'string',
          isValid: true,
          option: '',
        },
        addressType: 'string',
        deviceAddress: {
          value: 'string',
          isValid: true,
        },
        posId: {
          value: 'string',
          isValid: true,
        },
        serialNumber: {
          value: 'string',
          isValid: true,
        },
        testMode: true,
      },
      terminals: {
        '12345': {
          acquirerCode: 'wbc',
          autoAddress: false,
          deviceAddress: '192.03.49.01',
          posId: 'mx51',
          secureWebSocket: false,
          serialNumber: '321-497-742',
          testMode: true,
          pluginVersion: 'string',
          merchantId: '7487584',
          terminalId: '8547584',
          batteryLevel: '70%',
          flow: null,
          id: 'mx51',
          pairingFlow: null,
          secrets: null,
          settings: null,
          status: 'PairedConnected',
          terminalStatus: null,
          txFlow: null,
          txMessage: null,
          posVersion: '',
        },
        '7837239': {
          acquirerCode: 'wbc',
          autoAddress: false,
          deviceAddress: '192.03.49.01',
          posId: 'mx51',
          secureWebSocket: false,
          serialNumber: '321-497-742',
          testMode: true,
          pluginVersion: 'string',
          merchantId: '7487584',
          terminalId: '8547584',
          batteryLevel: '70%',
          flow: null,
          id: 'mx51',
          pairingFlow: null,
          secrets: null,
          settings: null,
          status: 'Connecting',
          terminalStatus: null,
          txFlow: null,
          txMessage: null,
          posVersion: '',
        },
      },
    };

    expect(pairedConnectedTerminalList(state)).toEqual([
      {
        acquirerCode: 'wbc',
        autoAddress: false,
        deviceAddress: '192.03.49.01',
        posId: 'mx51',
        secureWebSocket: false,
        serialNumber: '321-497-742',
        testMode: true,
        pluginVersion: 'string',
        merchantId: '7487584',
        terminalId: '8547584',
        batteryLevel: '70%',
        flow: null,
        id: 'mx51',
        pairingFlow: null,
        secrets: null,
        settings: null,
        status: 'PairedConnected',
        terminalStatus: null,
        txFlow: null,
        txMessage: null,
        posVersion: '',
      },
    ]);
  });
});
