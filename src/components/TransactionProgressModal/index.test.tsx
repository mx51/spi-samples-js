import React from 'react';
import { cleanup } from '@testing-library/react';
import TransactionProgressModal from '.';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { TEXT_CASHOUT, TEXT_PURCHASE, TEXT_REFUND } from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockTerminalInstanceId,
} from '../../utils/tests/common';

describe('Test <TransactionProgressModal />', () => {
  afterEach(cleanup);

  function transactionProgressModalSetup(
    transactionType: string,
    isFinished: boolean,
    isSuccess: boolean,
    transactionDesc = 'Transaction desc'
  ) {
    const cancelFn = jest.fn();
    const doneFn = jest.fn();
    const retryFn = jest.fn();

    const container = mockWithRedux(
      <TransactionProgressModal
        terminalId={mockTerminalInstanceId}
        transactionType={transactionType}
        transactionDesc={transactionDesc}
        isFinished={isFinished}
        isSuccess={isSuccess}
        onDone={doneFn}
        onCancelTransaction={cancelFn}
        onRetryTransaction={retryFn}
      />
    );
    return container;
  }

  test('should match TransactionProgressModalPage finished & success snapshot test', () => {
    // Arrange
    const container = transactionProgressModalSetup(TEXT_PURCHASE, true, true);
    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should match TransactionProgressModalPage finished & not success snapshot test', () => {
    // Arrange
    const container = transactionProgressModalSetup(TEXT_PURCHASE, true, false);
    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should match TransactionProgressModalPage pending snapshot test', () => {
    // Arrange
    const container = transactionProgressModalSetup(TEXT_PURCHASE, false, true);
    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should show "CASHOUT" as modal title when transactionType value is returned as "CashoutOnly"', () => {
    // Arrange
    transactionProgressModalSetup(SPI_TRANSACTION_TYPES.CashoutOnly, true, true);
    // Assert
    expect(document.body.innerHTML.includes(TEXT_CASHOUT.toUpperCase())).toBeTruthy();
  });

  test('should show "REFUND" as modal title when transactionType value is returned as "Refund"', () => {
    // Arrange
    transactionProgressModalSetup(SPI_TRANSACTION_TYPES.Refund, true, true);
    // Assert
    expect(document.body.innerHTML.includes(TEXT_REFUND.toUpperCase())).toBeTruthy();
  });

  test('should show modal description "Declined desc" when a transaction is declined', () => {
    // Arrange
    const transactionDesc = 'Declined desc';
    transactionProgressModalSetup(SPI_TRANSACTION_TYPES.Refund, true, false, transactionDesc);
    // Assert
    expect(document.body.innerHTML.includes(transactionDesc)).toBeTruthy();
  });

  test('should show signature flow with yes and no buttons', () => {
    // Arrange
    const modalTitle = 'Confirm customer signature';
    const customStore = {
      getState: () => ({
        common: { showFlowPanel: false },
        pairForm: defaultMockPairFormParams,
        terminals: {
          ...defaultMockTerminals,
          [mockTerminalInstanceId]: {
            ...defaultMockTerminals[mockTerminalInstanceId],
            txFlow: {
              awaitingSignatureCheck: true,
              finished: false,
              success: TxFlowState.Unknown,
            },
          },
        },
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    mockWithRedux(
      <TransactionProgressModal
        terminalId={mockTerminalInstanceId}
        transactionType={SPI_TRANSACTION_TYPES.Refund}
        transactionDesc="Signature desc"
        isFinished={false}
        isSuccess
        onDone={jest.fn()}
        onCancelTransaction={jest.fn()}
        onRetryTransaction={jest.fn()}
      />,
      customStore
    );

    const approveSignatureDOM = document.body.querySelector('[data-test-id="approveSignature"]') as Element;
    const declineSignatureDOM = document.body.querySelector('[data-test-id="declineSignature"]') as Element;

    // Assert
    expect(approveSignatureDOM.innerHTML.includes('Yes')).toBeTruthy();
    expect(declineSignatureDOM.innerHTML.includes('No')).toBeTruthy();
    expect(document.body.innerHTML.includes(modalTitle)).toBeTruthy();
  });
});
