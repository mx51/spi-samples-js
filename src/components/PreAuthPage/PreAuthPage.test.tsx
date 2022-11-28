import React from 'react';
import { cleanup } from '@testing-library/react';
import PreAuthPage from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <PreAuthPage />', () => {
  afterEach(cleanup);

  test('should match PreAuthPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<PreAuthPage />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
