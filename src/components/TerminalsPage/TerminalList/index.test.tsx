import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import TerminalList from '.';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { defaultAAR } from '../../../definitions/constants/spiConfigs';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { updatePairingStatus } from '../../../redux/reducers/TerminalSlice/terminalsSlice';
import spiService from '../../../services/spiService';
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
  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should match TerminalList snapshot test', () => {
    // Arrange
    const container = mockWithRedux(<TerminalList terminals={[mockTerminalConfig]} />);

    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should be able to click current un-pair terminal instance', () => {
    // Arrange
    mockWithRedux(<TerminalList terminals={[mockTerminalConfig]} />);
    const terminalRecord = document.querySelector(`#terminal_${mockTerminalInstanceId}`) as Element;

    // Act
    const dispatch = jest.fn().mockImplementation(() =>
      updatePairingStatus({
        id: mockTerminalInstanceId,
        status: SPI_PAIR_STATUS.Unpaired,
      })
    );

    fireEvent.click(terminalRecord);

    spiService.readTerminalInstance = jest.fn().mockReturnValue(() => ({
      spiClient: {
        Unpair: jest.fn(),
      },
    }));

    spiService.spiTerminalUnPair = jest
      .fn()
      .mockImplementation(() => spiService.readTerminalInstance(mockTerminalInstanceId));

    spiService.spiTerminalUnPair(mockTerminalInstanceId);
    dispatch();

    // Assert
    expect(spiService.spiTerminalUnPair).toBeDefined();
    expect(spiService.spiTerminalUnPair).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});
