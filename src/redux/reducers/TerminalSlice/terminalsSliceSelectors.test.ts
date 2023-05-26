import { cleanup } from '@testing-library/react';
import {
  defaultMockCommonState,
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockDefaultProducts,
  mockTerminalInstanceId,
  defaultMockSelectedTerminals,
  mockTxFlow,
} from '../../../utils/tests/common';
import {
  terminalList,
  terminalInstance,
  isTerminalUnpaired,
  pairedConnectedTerminalList,
  terminalTxAmount,
  terminalTxFlowSuccessTracker,
  terminalTxFlowFinishedTracker,
  terminalTxFlowAwaitingSignatureTracker,
  terminalTxTotalAmount,
} from './terminalsSliceSelectors';

const mockStoreState = {
  common: defaultMockCommonState,
  pairForm: defaultMockPairFormParams,
  products: mockDefaultProducts,
  terminals: {
    ...defaultMockTerminals,
    [mockTerminalInstanceId]: {
      ...defaultMockTerminals[mockTerminalInstanceId],
      txFlow: mockTxFlow,
    },
  },
  selectedTerminal: defaultMockSelectedTerminals,
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
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (isTerminalUnpaired(mockTerminalInstanceId) as Any).resultFunc(currentTerminalInstance);

    // Assert
    expect(actualResult).toBeFalsy();
  });

  test('Test terminalTxAmount', () => {
    // Act
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (terminalTxAmount(mockTerminalInstanceId) as Any).resultFunc(currentTerminalInstance);

    // Assert
    expect(actualResult).toEqual(100);
  });

  test('Test terminalTxFlowSuccessTracker', () => {
    // Act
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (terminalTxFlowSuccessTracker(mockTerminalInstanceId) as Any).resultFunc(
      currentTerminalInstance
    );

    // Assert
    expect(actualResult).toEqual('string');
  });

  test('Test terminalTxFlowFinishedTracker', () => {
    // Act
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (terminalTxFlowFinishedTracker(mockTerminalInstanceId) as Any).resultFunc(
      currentTerminalInstance
    );

    // Assert
    expect(actualResult).toEqual(true);
  });

  test('Test terminalTxFlowAwaitingSignatureTracker', () => {
    // Act
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (terminalTxFlowAwaitingSignatureTracker(mockTerminalInstanceId) as Any).resultFunc(
      currentTerminalInstance
    );

    // Assert
    expect(actualResult).toEqual(true);
  });

  test('should return terminal which are paired connected', () => {
    const state = {
      common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
      pair: { status: '' },
      products: {
        keypadAmount: 0,
        surchargeAmount: 0,
        tipAmount: 0,
        cashoutAmount: 0,
        promptForCashout: false,
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
          reconnecting: false,
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
          reconnecting: false,
          terminalStatus: null,
          txFlow: null,
          txMessage: null,
          posVersion: '',
        },
      },
      selectedTerminal: { selectedTerminalId: '' },
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
        reconnecting: false,
        terminalStatus: null,
        txFlow: null,
        txMessage: null,
        posVersion: '',
      },
    ]);
  });

  test('Test terminalTxTotalAmount', () => {
    // Act
    const currentTerminalInstance = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(
      terminalList(mockStoreState)
    );
    const actualResult = (terminalTxTotalAmount(mockTerminalInstanceId) as Any).resultFunc(currentTerminalInstance);

    // Assert
    expect(actualResult).toEqual(0);
  });
});
