import React from 'react';
import { fireEvent, screen, cleanup, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import OrderConfirmation from '.';
import { PATH_CASH_OUT, PATH_PAY_NOW, PATH_REFUND } from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import { store } from '../../redux/store';
import spiService from '../../services/spiService';
import mockWithRedux, {
  defaultMockPairFormParams,
  mockReceiptResponse,
  mockRefundTxFlow,
  mockTerminalInstanceId,
  pairedMockTerminals,
} from '../../utils/tests/common';

describe('Test <OrderConfirmation />', () => {
  let dispatch: Any;
  let customStore: Any;

  beforeEach(() => {
    dispatch = jest.fn();
    const spyDispatch = jest.spyOn(redux, 'useDispatch');
    spyDispatch.mockReturnValue(dispatch);
    customStore = {
      ...store,
      getState: () => ({
        common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
        pairForm: defaultMockPairFormParams,
        terminals: pairedMockTerminals,
        products: {
          keypadAmount: 0,
          surchargeAmount: 100,
          tipAmount: 0,
          cashoutAmount: 1000,
          products: [],
        },
        selectedTerminal: { selectedTerminalId: mockTerminalInstanceId },
      }),
    };
  });

  afterEach(cleanup);

  test('should match OrderConfirmationPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />, customStore);

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should clearAllProducts on amount override ', () => {
    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />, customStore);
    fireEvent.click(screen.getByText(/test/i));

    // Assert
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: '123-123-123',
      type: 'selectedTerminal/updateSelectedTerminal',
    });
  });

  test('should select a terminal from list', () => {
    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />, customStore);
    fireEvent.click(screen.getByText(/test/i));

    // Assert
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: '123-123-123',
      type: 'selectedTerminal/updateSelectedTerminal',
    });
  });

  test('should initiate purchase on clicking Card button', () => {
    // Arrange
    const initiatePurchaseTransaction = jest.spyOn(spiService, 'initiatePurchaseTransaction');
    initiatePurchaseTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />, customStore);
    fireEvent.click(screen.getByText(/card/i));

    // Assert
    expect(initiatePurchaseTransaction.mock.calls.length).toBe(1);
  });

  test('should initiate moto purchase on clicking Moto button', () => {
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />, customStore);
    fireEvent.click(screen.getByText(/moto/i));

    // Assert
    expect(initiateMotoPurchaseTransaction.mock.calls.length).toBe(1);
  });

  test('should cancel moto purchase on clicking Cancel button', () => {
    // Arrange
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const customStore2 = (mockTerminals: Any) => ({
      ...store,
      getState: () => ({
        common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
        terminals: mockTerminals,
        products: {
          keypadAmount: 0,
          surchargeAmount: 100,
          tipAmount: 0,
          cashoutAmount: 100,
          products: [],
        },
        selectedTerminal: { selectedTerminalId: mockTerminalInstanceId },
      }),
    });
    const mockTerminals = {
      [mockTerminalInstanceId]: {
        ...pairedMockTerminals[mockTerminalInstanceId],
        receipt: mockReceiptResponse,
        txFlow: {
          ...mockRefundTxFlow,
          finished: false,
          success: TxFlowState.Unknown,
        },
      },
    };

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    mockWithRedux(
      <OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />,
      customStore2(mockTerminals)
    );

    // Act
    fireEvent.click(screen.getByText(/moto/i));

    fireEvent.click(screen.getByText(/cancel/i));

    // Assert
    expect(spiCancelTransaction.mock.calls.length).toBe(1);
  });

  test('should disable Moto button when tip amount is larger than 0', () => {
    // Arrange
    const initiateRefundTxTransaction = jest.spyOn(spiService, 'initiateRefundTxTransaction');
    initiateRefundTxTransaction.mockReturnValue();

    const customStore2 = (mockTerminals: Any) => ({
      ...store,
      getState: () => ({
        common: { showFlowPanel: false, acquireConfirmPairingFlow: false },
        terminals: mockTerminals,
        products: {
          keypadAmount: 0,
          surchargeAmount: 100,
          tipAmount: 100,
          cashoutAmount: 0,
          products: [],
        },
        selectedTerminal: { selectedTerminalId: mockTerminalInstanceId },
      }),
    });
    const mockTerminals = {
      [mockTerminalInstanceId]: {
        ...pairedMockTerminals[mockTerminalInstanceId],
        receipt: mockReceiptResponse,
        txFlow: {
          ...mockRefundTxFlow,
          finished: false,
          success: TxFlowState.Unknown,
        },
      },
    };

    // Act
    mockWithRedux(
      <OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />,
      customStore2(mockTerminals)
    );
    const motoButton = screen.getByText(/Moto/i).closest('button');

    // Assert
    expect(motoButton).toHaveAttribute('disabled');
    expect(motoButton).toBeDisabled();
  });

  test('should clearAll products when total amount is changed', () => {
    // Arrange
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    // Act
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={600} />, customStore);
    fireEvent.click(screen.getByTestId('orderTotalButton'));
    fireEvent.click(screen.getByText(/5/i));
    fireEvent.click(screen.getByText(/ok/i));

    // Assert
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: undefined,
      type: 'product/clearProductsOnly',
    });
  });

  test('should close the keypad', async () => {
    // Arrange
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    // Act
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />, customStore);
    fireEvent.click(screen.getByTestId('orderTotalButton'));
    fireEvent.click(screen.getByLabelText(/close button/i));

    // Assert
    await waitFor(() => {
      expect(screen.queryByLabelText(/close button/i)).not.toBeInTheDocument();
    });
  });

  test('should show cashout button when pathname is cashout', () => {
    // Arrange
    const initiateCashoutOnlyTxTransaction = jest.spyOn(spiService, 'initiateCashoutOnlyTxTransaction');
    initiateCashoutOnlyTxTransaction.mockReturnValue();

    // Act
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_CASH_OUT} currentAmount={500} />, customStore);
    const cashoutButton = screen.queryByText(/Cashout/i);
    fireEvent.click(cashoutButton as Element);

    // Assert
    expect(cashoutButton).toBeInTheDocument();
  });

  test('should show refund button when pathname is refund', () => {
    // Arrange
    const initiateRefundTxTransaction = jest.spyOn(spiService, 'initiateRefundTxTransaction');
    initiateRefundTxTransaction.mockReturnValue();

    // Act
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_REFUND} currentAmount={500} />, customStore);
    const refundButton = screen.queryByText(/Refund/i);
    fireEvent.click(refundButton as Element);

    // Assert
    expect(refundButton).toBeInTheDocument();
  });
});
