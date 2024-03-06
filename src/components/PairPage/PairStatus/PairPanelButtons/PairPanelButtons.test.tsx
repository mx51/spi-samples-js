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
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.Unpaired, null, false);

    // Assert
    expect(panelButton.statusTitle).toEqual('Unpaired');
    expect(panelButton.statusText).toEqual('Not Ready');
    expect(panelButton.button as Any).toBeNull();
  });

  test('should show Pairing button when status is connecting', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnecting, null, false);
    const handleCancelPairClick = jest.fn();

    // Act
    handleCancelPairClick();

    // Assert
    expect(panelButton.statusTitle).toEqual('Pairing');
    expect(panelButton.statusText).toEqual('PairedConnecting');
    expect((panelButton.button as Any).props.onClick).toBeDefined();
    expect(handleCancelPairClick).toHaveBeenCalledTimes(1);
  });

  test('should show Unpair button when status is connected', () => {
    // Arrange
    const handleUnPairClick = jest.fn();

    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnected, null, false);

    // Assert
    expect(panelButton.statusTitle).toEqual('Paired');
    expect(panelButton.statusText).toEqual('Ready');
    expect((panelButton.button as Any).props.children[0].props.onClick).toBeDefined();
    expect(handleUnPairClick).toBeDefined();
  });

  test('should show "Reconnecting" status text when status is pair connecting and terminal has already paired', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnecting, null, true);

    // Assert
    expect(panelButton.statusTitle).toEqual('Reconnecting');
  });
});
