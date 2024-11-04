import React from 'react';
import { cleanup } from '@testing-library/react';
import PurchaseFlow from '.';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockTerminalInstanceId,
} from '../../utils/tests/common';

describe('Test <PurchaseFlow />', () => {
  afterEach(cleanup);

  const genericCustomStore = (txFlow: Any) => ({
    getState: () => ({
      common: { showFlowPanel: false },
      pairForm: defaultMockPairFormParams,
      terminals: {
        ...defaultMockTerminals,
        [mockTerminalInstanceId]: {
          ...defaultMockTerminals[mockTerminalInstanceId],
          txFlow,
        },
      },
      selectedTerminal: { id: mockTerminalInstanceId, connection: 'local' },
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  });

  test('should match SUCCESS STATUS contents as snapshot test', () => {
    // Arrange
    const customStore = genericCustomStore({
      awaitingSignatureCheck: true,
      finished: true,
      success: TxFlowState.Success,
    });
    const container = mockWithRedux(<PurchaseFlow />, customStore);

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should show TX PROCESS UPDATE contents as snapshot test', () => {
    // Arrange
    const customStore = genericCustomStore({
      awaitingSignatureCheck: false,
      finished: true,
      success: TxFlowState.Success,
    });
    const container = mockWithRedux(<PurchaseFlow />, customStore);

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should show FAILED STATUS contents as snapshot test', () => {
    // Arrange
    const customStore = genericCustomStore({
      awaitingSignatureCheck: false,
      finished: false,
      success: TxFlowState.Unknown,
    });
    const container = mockWithRedux(<PurchaseFlow />, customStore);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
