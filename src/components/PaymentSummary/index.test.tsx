import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import PaymentSummary from '.';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import { store } from '../../redux/store';
import mockWithRedux, {
  defaultMockPairFormParams,
  mockReceiptResponse,
  mockRefundTxFlow,
  mockTerminalInstanceId,
  pairedMockTerminals,
} from '../../utils/tests/common';

describe('Test <PaymentSummary />', () => {
  let mockContainer: Any;
  let customStore: Any;

  beforeEach(() => {
    mockContainer = mockWithRedux(<PaymentSummary />);
    customStore = (mockTerminals: Any) => ({
      ...store,
      getState: () => ({
        common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
        pairForm: defaultMockPairFormParams,
        terminals: mockTerminals,
        products: {
          surchargeAmount: 100,
          tipAmount: 100,
          cashoutAmount: 100,
          products: [],
        },
        selectedTerminal: { selectedTerminalId: mockTerminalInstanceId },
      }),
    });
  });

  afterEach(cleanup);

  test('should match PaymentSummary snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should call clearAllProducts() when new order button get clicked', () => {
    // Arrange
    const newOrderBtnDOM = mockContainer.querySelector('[data-test-id="newOrderBtn"]');
    const dispatch = jest.fn();
    dispatch(clearAllProducts());
    const actionBtnClassOccurrence = (mockContainer.innerHTML.match(/actionBtn/g) || []).length;

    // Act
    fireEvent.click(newOrderBtnDOM);

    // Assert
    expect(dispatch).toHaveBeenCalled();
    expect(actionBtnClassOccurrence).toBe(1);
  });

  test('should show approved text when transaction has been done successfully', () => {
    // Arrange
    const mockTerminals = {
      [mockTerminalInstanceId]: {
        ...pairedMockTerminals[mockTerminalInstanceId],
        receipt: mockReceiptResponse,
        txFlow: mockRefundTxFlow,
      },
    };
    const refundApprovedText = 'Refund Approved';
    const newMockContainer = mockWithRedux(<PaymentSummary />, customStore(mockTerminals));
    const actionBtnClassOccurrence = (newMockContainer.innerHTML.match(/actionBtn/g) || []).length;

    // Assert
    expect(newMockContainer.innerHTML.includes(refundApprovedText)).toBeTruthy();
    expect(actionBtnClassOccurrence).toBe(2);
  });

  test('should show declined text when transaction has failed', () => {
    // Arrange
    const mockTerminals = {
      [mockTerminalInstanceId]: {
        ...pairedMockTerminals[mockTerminalInstanceId],
        receipt: mockReceiptResponse,
        txFlow: {
          ...mockRefundTxFlow,
          success: TxFlowState.Failed,
        },
      },
    };

    const refundDeclinedText = 'Refund Declined';
    const newMockContainer = mockWithRedux(<PaymentSummary />, customStore(mockTerminals));
    const actionBtnClassOccurrence = (newMockContainer.innerHTML.match(/actionBtn/g) || []).length;

    // Assert
    expect(newMockContainer.innerHTML.includes(refundDeclinedText)).toBeTruthy();
    expect(actionBtnClassOccurrence).toBe(2);
  });
});
