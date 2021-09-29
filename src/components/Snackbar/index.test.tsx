import React from 'react';
import { cleanup } from '@testing-library/react';
import Snackbar from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <Snackbar />', () => {
  afterEach(cleanup);

  test('should match Snackbar snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<Snackbar />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
