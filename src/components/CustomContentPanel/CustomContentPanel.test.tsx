import React from 'react';
import { cleanup } from '@testing-library/react';
import CustomContentPanel from '.';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockReceiptContent,
  mockReceiptResponse,
  mockTerminalInstanceId,
} from '../../utils/tests/common';

describe('Test <CustomContentPanel />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = mockWithRedux(
      <CustomContentPanel title="Mock Receipt" css="{}">
        <pre>{mockReceiptContent}</pre>
      </CustomContentPanel>
    );
  });

  afterEach(cleanup);

  test('should match CustomContentPanel snapshot test', () => {
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
      <CustomContentPanel title="Mock Receipt" css="{}">
        <pre>{mockReceiptContent}</pre>
      </CustomContentPanel>,
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
      <CustomContentPanel title="Mock Receipt" css="{}">
        <pre>{fetchingText}</pre>
      </CustomContentPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes(fetchingText)).toBeTruthy();
  });
});
