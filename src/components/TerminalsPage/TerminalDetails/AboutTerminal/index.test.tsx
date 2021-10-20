import React from 'react';
import { cleanup } from '@testing-library/react';
import AboutTerminal from '.';
import {
  terminalConfigurationsPartOne,
  terminalConfigurationsPartTwo,
} from '../../../../definitions/constants/terminalConfigs';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../../../utils/tests/common';

describe('Test <AboutTerminal />', () => {
  afterEach(cleanup);

  test('should match AboutTerminal snapshot test', () => {
    // Arrange
    const container = mockWithRedux(
      <AboutTerminal
        receiptToggle={false}
        setReceiptToggle={jest.fn()}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      />
    );

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should show "%" with battery value when SPI response data is available', () => {
    // Arrange
    const terminal = {
      ...defaultMockTerminals[mockTerminalInstanceId],
      batteryLevel: '70',
    };

    // Act
    const terminalConfigResponse = terminalConfigurationsPartOne(terminal);

    // Assert
    expect(terminalConfigResponse[3].content).toBe('70%');
  });

  test('should show "Yes" value in terminal details page when address type is auto', () => {
    // Arrange
    const terminal = {
      ...defaultMockTerminals[mockTerminalInstanceId],
      autoAddress: true,
    };

    // Act
    const terminalConfigResponse = terminalConfigurationsPartTwo(terminal);

    // Assert
    expect(terminalConfigResponse[1].content).toBe('Yes');
  });
});
