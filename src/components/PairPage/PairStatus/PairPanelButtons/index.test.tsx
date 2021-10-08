import React from 'react';
import { cleanup } from '@testing-library/react';
import PairPanelButtons from '.';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../../redux/hooks';
import { defaultEFTPOSBasedPairFormParams, mockSerialNumber } from '../../../../utils/tests/common';
import useStyles from '../index.styles';

jest.mock('../index.styles');
jest.mock('../../../../redux/hooks');

describe('Test PairPanelButtons', () => {
  beforeEach(() => {
    (useStyles as Any).mockReturnValue({
      unpairedIcon: {
        color: '#fff',
      },
    });

    (useAppSelector as Any).mockReturnValue({
      pairForm: defaultEFTPOSBasedPairFormParams,
      terminal: {
        [mockSerialNumber]: {
          flow: null,
          id: mockSerialNumber,
          pairingFlow: null,
          secret: null,
          settings: {},
          terminalConfig: {},
          terminalStatus: '',
          txFlow: null,
          txMessage: null,
        },
      },
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('should show Pair button when status is disconnected', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.Unpaired);

    // Assert
    expect(panelButton.statusTitle).toEqual('Unpaired');
    expect(panelButton.statusText).toEqual('Idle');
    expect((panelButton.button as Any).props.onClick).toBeDefined();
  });

  test('should show Pair button when status is connecting', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnecting);

    // Assert
    expect(panelButton.statusTitle).toEqual('PairedConnecting');
    expect(panelButton.statusText).toEqual('Pairing');
    expect((panelButton.button as Any).props.onClick).toBeDefined();
  });

  test('should show Pair button when status is connecting', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnected);

    // Assert
    expect(panelButton.statusTitle).toEqual('PairedConnected');
    expect(panelButton.statusText).toEqual('Transaction');
    expect((panelButton.button as Any).props.children[0].props.onClick).toBeDefined();
  });
});
