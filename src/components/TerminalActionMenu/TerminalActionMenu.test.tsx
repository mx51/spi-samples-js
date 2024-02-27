import React from 'react';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { defaultAAR } from '../../definitions/constants/spiConfigs';
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../utils/tests/common';
import TerminalActionMenu from '.';

jest.mock('../../services/spiService');

const mockTerminalConfig: ITerminalProps = {
  ...defaultMockTerminals[mockTerminalInstanceId],
  deviceAddress: defaultAAR,
  posId: 'test',
  serialNumber: mockTerminalInstanceId,
  status: SPI_PAIR_STATUS.Unpaired,
};

describe('Test <TerminalActionMenu />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = mockWithRedux(<TerminalActionMenu terminal={mockTerminalConfig} />);
  });

  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should match snapshot', async () => {
    expect(mockContainer).toMatchSnapshot();
  });

  test('should open action menu', async () => {
    const terminalActionButtonTestId = `terminal-action-button-${mockTerminalInstanceId}`;
    fireEvent.click(screen.getByTestId(terminalActionButtonTestId));
    const menuItemPair = await screen.getByText('Pair terminal');
    const menuItemAbout = await screen.getByText('About this terminal');

    expect(menuItemPair).toBeInTheDocument();
    expect(menuItemAbout).toBeInTheDocument();
  });
});
