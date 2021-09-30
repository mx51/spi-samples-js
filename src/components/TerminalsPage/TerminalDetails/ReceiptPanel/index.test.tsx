import React from 'react';
import { cleanup } from '@testing-library/react';
import ReceiptPanel from '.';
import mockWithRedux from '../../../../utils/tests/common';

describe('Test <ReceiptPanel />', () => {
  afterEach(cleanup);

  test('should match ReceiptPanel snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<ReceiptPanel />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
