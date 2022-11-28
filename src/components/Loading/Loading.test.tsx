import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Loading from '.';

describe('Test <Loading />', () => {
  afterEach(cleanup);

  test('should match Loading component snapshot test', () => {
    // Arrange
    const { container } = render(<Loading />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
