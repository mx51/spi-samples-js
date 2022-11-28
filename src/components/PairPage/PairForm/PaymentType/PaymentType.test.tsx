import React from 'react';
import { cleanup } from '@testing-library/react';
import PaymentType from '.';
import mockWithRedux from '../../../../utils/tests/common';

describe('Test <PaymentType />', () => {
  afterEach(cleanup);

  test('should match PaymentType snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<PaymentType />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
