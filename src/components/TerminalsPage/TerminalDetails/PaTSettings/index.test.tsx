import React from 'react';
import { cleanup } from '@testing-library/react';
import PaTSettings from '.';
import mockWithRedux from '../../../../utils/tests/common';

describe('Test <PaTSettings />', () => {
  afterEach(cleanup);

  test('should match PaTSettings snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<PaTSettings />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
