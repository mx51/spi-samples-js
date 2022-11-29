import React from 'react';
import { cleanup } from '@testing-library/react';
import ThemeStyles from '.';
import mockWithRedux from '../../utils/tests/common';
import NotFoundPage from '../NotFoundPage';

describe('Test <ThemeStyles />', () => {
  afterEach(cleanup);

  test('should match ThemeStyles snapshot test', () => {
    // Arrange
    const container = mockWithRedux(
      <ThemeStyles>
        <NotFoundPage />
      </ThemeStyles>
    );

    // Assert
    expect(container).toMatchSnapshot();
  });
});
