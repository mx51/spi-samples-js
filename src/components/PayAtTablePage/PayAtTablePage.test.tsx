import React from 'react';
import { cleanup } from '@testing-library/react';
import PayAtTablePage from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <PayAtTablePage />', () => {
  afterEach(cleanup);

  test('should match PayAtTablePage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<PayAtTablePage />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
