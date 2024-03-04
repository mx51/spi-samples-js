import React from 'react';
import { cleanup, fireEvent, screen } from '@testing-library/react';
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

  test('should open terminal action menu', async () => {
    // Arrange
    const terminalActionButtonTestId = `terminal-action-button-${mockTerminalInstanceId}`;

    // Act
    fireEvent.click(screen.getByTestId(terminalActionButtonTestId));
    const menuItemAbout = await screen.getByText('About this terminal');

    // Assert
    expect(menuItemAbout).toBeInTheDocument();
  });

  test('should navigate to about page from action menu', async () => {
    // Arrange
    const terminalActionButtonTestId = `terminal-action-button-${mockTerminalInstanceId}`;

    // Act
    fireEvent.click(screen.getByTestId(terminalActionButtonTestId));

    const menuItemAbout = await screen.getByText('About this terminal');
    fireEvent.click(menuItemAbout);

    // Assert
    expect(window.location.href.includes('/terminals/123-123-123')).toBeTruthy();
  });

  test('should navigate to pairing page from action menu', async () => {
    // Arrange
    const terminalActionButtonTestId = `terminal-action-button-${mockTerminalInstanceId}`;

    // Act
    fireEvent.click(screen.getByTestId(terminalActionButtonTestId));

    const menuPair = await screen.getByText('Pair terminal');
    fireEvent.click(menuPair);

    // Assert
    expect(window.location.href.includes('/terminals/new/123-123-123')).toBeTruthy();
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
