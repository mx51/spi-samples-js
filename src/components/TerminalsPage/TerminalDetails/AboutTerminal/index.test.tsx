import React from 'react';
import { cleanup } from '@testing-library/react';
import AboutTerminal from '.';
import mockWithRedux from '../../../../utils/tests/common';

describe('Test <AboutTerminal />', () => {
  afterEach(cleanup);

  test('should match AboutTerminal snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<AboutTerminal />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
