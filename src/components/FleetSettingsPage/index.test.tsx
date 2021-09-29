import React from 'react';
import { cleanup } from '@testing-library/react';
import FleetSettingsPage from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <FleetSettingsPage />', () => {
  afterEach(cleanup);

  test('should match FleetSettingsPage snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<FleetSettingsPage />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
