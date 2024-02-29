import React from 'react';
import { cleanup } from '@testing-library/react';
import NotFoundPage from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <NotFoundPage />', () => {
  afterEach(cleanup);

  test('should match NotFoundPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<NotFoundPage />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
