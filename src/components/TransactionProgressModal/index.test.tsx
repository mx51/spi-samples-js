import React from 'react';
import { cleanup } from '@testing-library/react';
import TransactionProgressModal from '.';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { TEXT_CASHOUT, TEXT_PURCHASE } from '../../definitions/constants/routerConfigs';
import mockWithRedux from '../../utils/tests/common';

describe('Test <TransactionProgressModal />', () => {
  afterEach(cleanup);

  function transactionProgressModalSetup(transactionType: string, isFinished: boolean, isSuccess: boolean) {
    const cancelFn = jest.fn();
    const doneFn = jest.fn();

    const container = mockWithRedux(
      <TransactionProgressModal
        transactionType={transactionType}
        isFinished={isFinished}
        isSuccess={isSuccess}
        onDone={doneFn}
        onCancelTransaction={cancelFn}
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
});
