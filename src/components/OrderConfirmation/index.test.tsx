import React from 'react';
import { fireEvent, screen, cleanup, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import OrderConfirmation from '.';
import { PATH_PAY_NOW } from '../../definitions/constants/routerConfigs';
import spiService from '../../services/spiService';
import mockWithRedux from '../../utils/tests/common';

describe('Test <OrderConfirmation />', () => {
  let dispatch: Any;

  beforeEach(() => {
    const spyDispatch = jest.spyOn(redux, 'useDispatch');
    dispatch = jest.fn();
    spyDispatch.mockReturnValue(dispatch);
    const spySelector = jest.spyOn(redux, 'useSelector');
    spySelector.mockReturnValue([
      {
        id: '123324343',
        deviceAddress: 'deviceAddress',
        posId: 'posId123',
        serialNumber: 'serialNumber',
      },
    ]);
  });

  afterEach(cleanup);

  test('should match OrderConfirmationPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />);

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should clearAllProducts on amount override ', () => {
    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />);
    fireEvent.click(screen.getByText(/posId123/i));

    // Assert
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: '123324343',
      type: 'selectedTerminal/updateSelectedTerminal',
    });
  });

  test('should select a terminal from list', () => {
    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname="/" currentAmount={500} />);
    fireEvent.click(screen.getByText(/posId123/i));

    // Assert
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: '123324343',
      type: 'selectedTerminal/updateSelectedTerminal',
    });
  });

  test('should initiate purchase on clicking Card button', () => {
    const initiatePurchaseTransaction = jest.spyOn(spiService, 'initiatePurchaseTransaction');
    initiatePurchaseTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />);
    fireEvent.click(screen.getByText(/card/i));

    // Assert
    expect(initiatePurchaseTransaction.mock.calls.length).toBe(1);
  });

  test('should initiate moto purchase on clicking Moto button', () => {
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />);
    fireEvent.click(screen.getByText(/moto/i));

    // Assert
    expect(initiateMotoPurchaseTransaction.mock.calls.length).toBe(1);
  });

  test('should cancel moto purchase on clicking Cancel button', () => {
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />);
    fireEvent.click(screen.getByText(/moto/i));

    fireEvent.click(screen.getByText(/cancel/i));

    // Assert
    expect(spiCancelTransaction.mock.calls.length).toBe(1);
  });

  test('should clearAll products when total amount is changed', () => {
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    // Arrange
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={600} />);
    fireEvent.click(screen.getByTestId('orderTotalButton'));
    fireEvent.click(screen.getByText(/5/i));
    fireEvent.click(screen.getByText(/ok/i));

    // Assert
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: undefined,
      type: 'product/clearAllProducts',
    });
  });
  test('should close the keypad', async () => {
    const initiateMotoPurchaseTransaction = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');
    initiateMotoPurchaseTransaction.mockReturnValue();

    const spiCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');
    spiCancelTransaction.mockReturnValue();

    // Act
    mockWithRedux(<OrderConfirmation title="title" pathname={PATH_PAY_NOW} currentAmount={500} />);
    fireEvent.click(screen.getByTestId('orderTotalButton'));
    fireEvent.click(screen.getByLabelText(/close button/i));

    // Assert
    await waitFor(() => {
      expect(screen.queryByLabelText(/close button/i)).not.toBeInTheDocument();
    });
  });
});
