import React from 'react';
import { cleanup } from '@testing-library/react';
import Cashout from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <Cashout />', () => {
  afterEach(cleanup);

  test('should match Cashout snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<Cashout />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
