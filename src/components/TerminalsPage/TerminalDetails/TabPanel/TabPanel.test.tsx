import React from 'react';
import { cleanup } from '@testing-library/react';
import TabPanel from '.';
import { TxFlowState } from '../../../../definitions/constants/terminalConfigs';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockReceiptResponse,
  mockTerminalInstanceId,
  pairedMockTerminals,
} from '../../../../utils/tests/common';

describe('Test <TabPanel />', () => {
  afterEach(cleanup);

  test('should match TabPanel snapshot test', () => {
    // Arrange
    const customizedStore = {
      getState: () => ({
        common: { showFlowPanel: true },
        pairForm: defaultMockPairFormParams,
        products: [],
        terminals: defaultMockTerminals,
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    const container = mockWithRedux(
      <TabPanel
        index={0}
        subtitle="Test tab 1 subtitle"
        title="Test tab 1 title"
        value={0}
        receiptToggle={{
          settlement: true,
          settlementEnquiry: false,
        }}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel One</div>
      </TabPanel>,
      customizedStore
    );

    // Assert
    expect(container).toMatchSnapshot();
    expect(container.innerHTML.includes('<div>Test Panel One</div>')).toBeTruthy();
    expect(container.innerHTML.includes('Flow')).toBeTruthy(); // proves flow is opened as flow content is part of DOM
  });

  test('should show receipt panel when receiptToggle value is true', () => {
    const container = mockWithRedux(
      <TabPanel
        index={1}
        subtitle="Test tab 2 subtitle"
        title="Test tab 2 title"
        value={1}
        receiptToggle={{
          settlement: false,
          settlementEnquiry: true,
        }}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel Two</div>
      </TabPanel>
    );

    expect(container.innerHTML.includes('Settlement Enquiry Receipt')).toBeTruthy();
    expect(container.innerHTML.includes('Test Panel Two')).toBeTruthy();
  });

  test('should display receipt loading status message when txFlow finished is false and success is Unknown', () => {
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
      <TabPanel
        index={0}
        subtitle="Test tab 1 subtitle"
        title="Test tab 1 title"
        value={0}
        receiptToggle={{
          settlement: false,
          settlementEnquiry: true,
        }}
        terminal={pairedMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel One</div>
      </TabPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes('Settle Initiated. Will be updated with Progress.')).toBe(true);
  });

  test('should display receipt with error when txFlow finished is false and success is Failed', () => {
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
              success: TxFlowState.Failed,
            },
          },
        },
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    const newMockContainer = mockWithRedux(
      <TabPanel
        index={0}
        subtitle="Test tab 1 subtitle"
        title="Test tab 1 title"
        value={0}
        receiptToggle={{
          settlement: false,
          settlementEnquiry: true,
        }}
        terminal={pairedMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel One</div>
      </TabPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes('Settle Initiated. Will be updated with Progress.')).toBe(false);
    expect(newMockContainer.innerHTML.includes('Could not initiate settle:')).toBe(true);
  });

  test('should display receipt content when txFlow finished is true and success is Success', () => {
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
      <TabPanel
        index={0}
        subtitle="Test tab 1 subtitle"
        title="Test tab 1 title"
        value={0}
        receiptToggle={{
          settlement: false,
          settlementEnquiry: true,
        }}
        terminal={pairedMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel One</div>
      </TabPanel>,
      customizedStore
    );

    // Assert
    expect(newMockContainer.innerHTML.includes('EFTPOS FROM TEST TENANT')).toBe(true);
  });
});
