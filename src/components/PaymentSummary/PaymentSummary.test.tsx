import React from 'react';
import { cleanup, screen, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import PaymentSummary from '.';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import { store } from '../../redux/store';
import '@testing-library/jest-dom/extend-expect';

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
  let dispatch: Any;

  beforeEach(() => {
    dispatch = jest.fn();
    const spyDispatch = jest.spyOn(redux, 'useDispatch');
    spyDispatch.mockReturnValue(dispatch);
    mockContainer = mockWithRedux(<PaymentSummary />);
    customStore = (mockTerminals: Any) => ({
      ...store,
      getState: () => ({
        common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
        pairForm: defaultMockPairFormParams,
        terminals: mockTerminals,
        products: {
          keypadAmount: 0,
          surchargeAmount: 100,
          tipAmount: 100,
          bankCashAmount: 100,
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
    dispatch = jest.fn();
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

    const refundDeclinedText = 'Refund Failed';
    const newMockContainer = mockWithRedux(<PaymentSummary />, customStore(mockTerminals));
    const actionBtnClassOccurrence = (newMockContainer.innerHTML.match(/actionBtn/g) || []).length;

    // Assert
    expect(newMockContainer.innerHTML.includes(refundDeclinedText)).toBeTruthy();
    expect(actionBtnClassOccurrence).toBe(2);
  });

  function renderPurchaseSummaryComponent(isSuccess: boolean) {
    const mockTerminals = {
      [mockTerminalInstanceId]: {
        ...pairedMockTerminals[mockTerminalInstanceId],
        posId: '123',
        receipt: mockReceiptResponse,
        txFlow: {
          ...mockRefundTxFlow,
          finished: true,
          success: isSuccess ? 'Success' : 'Failed',
          request: {
            data: {
              purchaseAmount: 550,
              surchargeAmount: 100,
              bankCashAmount: 200,
              cashoutAmount: 100,
              tipAmount: 150,
            },
          },
        },
      },
    };
    return mockWithRedux(<PaymentSummary />, customStore(mockTerminals));
  }

  test('should match snapshot for Purchase success', () => {
    const container = renderPurchaseSummaryComponent(true);
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot for Purchase failure', () => {
    const container = renderPurchaseSummaryComponent(false);
    expect(container).toMatchSnapshot();
  });

  test('should clear all products on new order', () => {
    renderPurchaseSummaryComponent(true);

    fireEvent.click(screen.getAllByText(/New Order/i)[0]);

    expect(dispatch).toBeCalledWith({ type: 'product/clearAllProducts' });
  });
});
