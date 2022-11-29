import React from 'react';
import { cleanup } from '@testing-library/react';
import RefundPage from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <RefundPage />', () => {
  afterEach(cleanup);

  test('should match RefundPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<RefundPage />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
