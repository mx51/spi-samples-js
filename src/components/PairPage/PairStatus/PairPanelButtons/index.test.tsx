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
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.Unpaired);

    // Assert
    expect(panelButton.statusTitle).toEqual('Unpaired');
    expect(panelButton.statusText).toEqual('Idle');
    expect(panelButton.button as Any).toBeNull();
  });

  test('should show Pairing button when status is connecting', () => {
    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnecting);
    const handleCancelPairClick = jest.fn();

    // Act
    handleCancelPairClick();

    // Assert
    expect(panelButton.statusTitle).toEqual('PairedConnecting');
    expect(panelButton.statusText).toEqual('Pairing');
    expect((panelButton.button as Any).props.onClick).toBeDefined();
    expect(handleCancelPairClick).toHaveBeenCalledTimes(1);
  });

  test('should show Unpair button when status is connected', () => {
    // Arrange
    const handleUnPairClick = jest.fn();

    // Act
    const panelButton = PairPanelButtons(SPI_PAIR_STATUS.PairedConnected);

    // Assert
    expect(panelButton.statusTitle).toEqual('PairedConnected');
    expect(panelButton.statusText).toEqual('Transaction');
    expect((panelButton.button as Any).props.children[0].props.onClick).toBeDefined();
    expect(handleUnPairClick).toBeDefined();
  });
});
