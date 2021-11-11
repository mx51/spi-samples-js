import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import FlowPanel, { getReceiptSchemes } from '.';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, {
  defaultMockPairFormParams,
  mockReceiptResponse,
  mockPairingFlow,
  mockTerminalInstanceId,
  mockTerminalsConfigs,
  pairedMockTerminals,
} from '../../../utils/tests/common';

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = pairedMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      common: { showFlowPanel: true, acquireConfirmPairingFlow: true },
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<FlowPanel />, customizedStore);
}

describe('Test <FlowPanel />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
  });

  afterEach(cleanup);

  test('should show not paring flow params', () => {
    // Arrange
    const EFTPOS = defaultLocalIP;

    // Assert
    expect(mockContainer.innerHTML.includes(EFTPOS)).toBe(true);
  });

  test('show pairing flow messages', () => {
    // Arrange
    const mockPairingFlowMessages = [
      'Requesting to Pair...',
      'Finished? false',
      'Successful? false',
      'Confirmation Code',
      'Waiting Confirm from Eftpos? false',
      'Waiting Confirm from POS? false',
    ];
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ pairingFlow: mockPairingFlow, status: SPI_PAIR_STATUS.PairedConnecting })
    );

    // Assert
    for (let messageIndex = 0; messageIndex < mockPairingFlowMessages.length; messageIndex += 1) {
      expect(newMockContainer.innerHTML.includes(mockPairingFlowMessages[messageIndex])).toBeTruthy();
    }
  });

  test('show display pairingFlow flow message', () => {
    // Arrange
    const flowMessage = 'Requesting to Pair...';

    // Act
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ pairingFlow: mockPairingFlow })
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(flowMessage)).toBeTruthy();
  });

  test('show display pos version value', () => {
    // Arrange
    const mockPosVersion = 'v1.1.1';

    // Act
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ posVersion: mockPosVersion, status: SPI_PAIR_STATUS.PairedConnected })
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(mockPosVersion)).toBeTruthy();
  });

  test('show display plugin version value', () => {
    // Arrange
    const mockPluginVersion = 'v2.2.2';

    // Act
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ pluginVersion: mockPluginVersion, status: SPI_PAIR_STATUS.PairedConnected })
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(mockPluginVersion)).toBeTruthy();
  });

  test('show display spi version value', () => {
    // Arrange
    const mockPluginVersion = 'v2.2.3';
    const mockText = 'POS: - Spi: v2.2.3';

    // Act
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({
        posVersion: null,
        pluginVersion: mockPluginVersion,
        status: SPI_PAIR_STATUS.PairedConnected,
      })
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(mockText)).toBeTruthy();
  });

  test('show display plugin version value', () => {
    // Arrange
    const mockPosVersion = '1.1.3';
    const mockText = 'POS: v1.1.3 Spi: -';

    // Act
    const newMockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({
        posVersion: mockPosVersion,
        status: SPI_PAIR_STATUS.PairedConnected,
      })
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(mockText)).toBeTruthy();
  });

  test('display scheme message during calling getReceiptSchemes()', () => {
    // Arrange
    const mockSchemes = [{ scheme_name: 'test', settle_by_acquirer: 'test', total_count: '1', total_value: '1' }];
    const expectedSchemeText = 'Scheme Name: test, Settle By Acquirer: test, Total Count: 1, Total Value: 1';

    // Act
    const result = getReceiptSchemes(mockSchemes);

    // Assert
    expect(result.trim()).toBe(expectedSchemeText);
  });

  test('display empty string ("") message when schemes is set as [] during calling getReceiptSchemes()', () => {
    // Arrange
    const mockSchemes: [] = [];
    const expectedSchemeText = '';

    // Act
    const result = getReceiptSchemes(mockSchemes);

    // Assert
    expect(result).toBe(expectedSchemeText);
  });

  test('should return transaction flow receipt flow content', () => {
    // Arrange
    const mockReceiptTitle = 'SETTLEMENT SUCCESSFUL!';
    const mockSchemesText = 'Scheme Name: string, Settle By Acquirer: string, Total Count: string, Total Value: string';
    const mockTerminalWithReceipt = {
      ...pairedMockTerminals[mockTerminalInstanceId],
      receipt: mockReceiptResponse,
    };
    const newMockContainer = mockWithRedux(<FlowPanel terminal={mockTerminalWithReceipt} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(mockReceiptTitle)).toBeTruthy();
    expect(newMockContainer.innerHTML.includes(mockSchemesText)).toBeTruthy();
  });

  test('should return failed transaction flow receipt flow content when success value is false', () => {
    // Arrange
    const mockReceiptTitle = 'SETTLEMENT FAILED!';
    const mockTerminalWithReceipt = {
      ...pairedMockTerminals[mockTerminalInstanceId],
      receipt: {
        ...mockReceiptResponse,
        success: false,
      },
    };
    const newMockContainer = mockWithRedux(<FlowPanel terminal={mockTerminalWithReceipt} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(mockReceiptTitle)).toBeTruthy();
  });

  test('should not display any scheme message inside flow panel when schemes list are empty', () => {
    // Arrange
    const mockSchemeText = 'Scheme Name';
    const mockResult = `
# SCHEME SETTLEMENTS:


    `;

    const mockTerminalWithReceipt = {
      ...pairedMockTerminals[mockTerminalInstanceId],
      receipt: {
        ...mockReceiptResponse,
        schemes: [],
      },
    };
    const newMockContainer = mockWithRedux(<FlowPanel terminal={mockTerminalWithReceipt} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(mockSchemeText)).toBeFalsy();
    expect(newMockContainer.innerHTML.includes(mockResult)).toBe(true);
  });
});
