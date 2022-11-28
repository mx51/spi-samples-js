import React from 'react';
import { cleanup } from '@testing-library/react';
import UnknownTransactionModal from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <UnknownTransactionModal />', () => {
  afterEach(cleanup);

  test('should match UnknownTransactionModal snapshot test', () => {
    const onFailedTransaction = jest.fn();
    const onSuccessTransaction = jest.fn();

    // Arrange
    const container = mockWithRedux(
      <UnknownTransactionModal onFailedTransaction={onFailedTransaction} onSuccessTransaction={onSuccessTransaction} />
    );

    // Assert
    expect(container).toMatchSnapshot();
  });
});
