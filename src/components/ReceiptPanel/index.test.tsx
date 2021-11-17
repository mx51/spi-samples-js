import React from 'react';
import { cleanup } from '@testing-library/react';
import ReceiptPanel from '.';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockReceiptContent,
  mockReceiptResponse,
  mockTerminalInstanceId,
} from '../../utils/tests/common';

describe('Test <ReceiptPanel />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = mockWithRedux(
      <ReceiptPanel title="Mock Receipt" css="{}">
        <pre>{mockReceiptContent}</pre>
      </ReceiptPanel>
    );
  });

  afterEach(cleanup);

  test('should match ReceiptPanel snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should show the receipt content when receipt response is returned', () => {
    // Arrange
    const customizedStore = {
      getState: () => ({
        common: { showFlowPanel: false },
        pairForm: defaultMockPairFormParams,
        terminals: {
          ...defaultMockTerminals,
          [mockTerminalInstanceId]: {
            ...defaultMockTerminals[mockTerminalInstanceId],
            receipt: mockReceiptResponse,
            txFlow: {
              finished: true,
              success: TxFlowState.Success,
            },
          },
        },
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    const newMockContainer = mockWithRedux(
      <ReceiptPanel title="Mock Receipt" css="{}">
        <pre>{mockReceiptContent}</pre>
      </ReceiptPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(mockReceiptContent)).toBeTruthy();
  });

  test('should display loading message when requesting a settlement receipt', () => {
    // Arrange
    const fetchingText = 'Settle Initiated. Will be updated with Progress.';
    const customizedStore = {
      getState: () => ({
        common: { showFlowPanel: false },
        pairForm: defaultMockPairFormParams,
        terminals: {
          ...defaultMockTerminals,
          [mockTerminalInstanceId]: {
            ...defaultMockTerminals[mockTerminalInstanceId],
            receipt: mockReceiptResponse,
            txFlow: {
              finished: false,
              success: TxFlowState.Unknown,
            },
          },
        },
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    const newMockContainer = mockWithRedux(
      <ReceiptPanel title="Mock Receipt" css="{}">
        <pre>{fetchingText}</pre>
      </ReceiptPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(fetchingText)).toBeTruthy();
  });
});
