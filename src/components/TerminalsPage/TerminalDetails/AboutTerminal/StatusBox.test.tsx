import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import StatusBox from './StatusBox';

describe('Test <StatusBox />', () => {
  afterEach(cleanup);

  test('should display different status UI DOMs', () => {
    // Arrange
    const statusOptions = Object.values(SPI_PAIR_STATUS);
    const responses = ['Connected', 'Connecting', 'Disconnected'];

    for (let index = 0; index < statusOptions.length; index += 1) {
      const { container } = render(<StatusBox status={statusOptions[index]} />);

      // Assert
      expect(container.innerHTML.includes(responses[index])).toBeTruthy();
    }
  });
});
