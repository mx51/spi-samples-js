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
    // Arrange
    const terminalNotConnectedClass = 'makeStyles-unclickable';

    // Assert
    expect(mockContainer).toMatchSnapshot();
    expect(mockContainer.innerHTML.includes(terminalNotConnectedClass)).toBeTruthy();
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

  test('should be unclickable when terminal status is unpaired', () => {
    // Arrange
    const terminalConnectedClass = 'makeStyles-link';
    const newNockTerminalConfig = {
      ...mockTerminalConfig,
      status: SPI_PAIR_STATUS.PairedConnected,
    };
    const newMockContainer = mockWithRedux(<TerminalList terminals={[newNockTerminalConfig]} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(terminalConnectedClass)).toBeTruthy();
  });

  test('should show chipPending classname when terminal status is PairedConnecting', () => {
    // Arrange
    const chipPendingClass = 'chipPending';
    const newNockTerminalConfig = {
      ...mockTerminalConfig,
      status: SPI_PAIR_STATUS.PairedConnecting,
    };
    const newMockContainer = mockWithRedux(<TerminalList terminals={[newNockTerminalConfig]} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(chipPendingClass)).toBeTruthy();
  });

  test('should show chipUnpaired classname when terminal status is unknown', () => {
    // Arrange
    const chipUnpairedClass = 'chipUnpaired';
    const newNockTerminalConfig = {
      ...mockTerminalConfig,
      status: 'Unknown Status',
    };
    const newMockContainer = mockWithRedux(<TerminalList terminals={[newNockTerminalConfig]} />);

    // Assert
    expect(newMockContainer.innerHTML.includes(chipUnpairedClass)).toBeTruthy();
  });
});
