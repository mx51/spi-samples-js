import React from 'react';
import { cleanup } from '@testing-library/react';
import PayNow from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <PayNow />', () => {
  afterEach(cleanup);

  test('should match PayNowPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<PayNow />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
