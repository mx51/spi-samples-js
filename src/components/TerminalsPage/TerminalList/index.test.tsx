import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import TerminalList from '.';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { defaultAAR } from '../../../definitions/constants/spiConfigs';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../../utils/tests/common';

jest.mock('../../../services/spiService');

const mockTerminalConfig: ITerminalProps = {
  ...defaultMockTerminals[mockTerminalInstanceId],
  deviceAddress: defaultAAR,
  posId: 'test',
  serialNumber: mockTerminalInstanceId,
  status: SPI_PAIR_STATUS.Unpaired,
};

describe('Test <TerminalList />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = mockWithRedux(<TerminalList terminals={[mockTerminalConfig]} />);
  });

  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should match TerminalList snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should be able to click current un-pair terminal instance', () => {
    // Arrange
    const terminalRecord = document.querySelector(`#terminal_${mockTerminalInstanceId}`) as Element;
    const goToTerminalDetails = jest.fn();

    // Act
    fireEvent.click(terminalRecord);
    goToTerminalDetails();

    // Assert
    expect(window.location.href.includes('/terminals/123-123-123')).toBeTruthy();
  });

  test('should not display any record if terminal number does not exist', () => {
    // Arrange
    const newMockTerminalConfig: ITerminalProps = {
      ...mockTerminalConfig,
      serialNumber: '',
    };

    const newMockContainer = mockWithRedux(<TerminalList terminals={[newMockTerminalConfig]} />);
    const terminalRecord = newMockContainer.querySelector(`#terminal_${mockTerminalInstanceId}`) as Element;

    // Assert
    expect(terminalRecord).toBeNull();
  });
});
