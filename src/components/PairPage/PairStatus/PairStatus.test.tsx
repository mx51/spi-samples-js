import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import PairStatus from '.';
import { SPI_PAIR_STATUS, TEXT_FORM_DEFAULT_VALUE } from '../../../definitions/constants/commonConfigs';
import { IPairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockPairingFlow,
  mockTerminalInstanceId,
  mockTerminalsConfigs,
} from '../../../utils/tests/common';

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = defaultMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<PairStatus />, customizedStore);
}

describe('Test <PairStatus />', () => {
  afterEach(cleanup);

  test('should show Cancel Paring button when connecting a terminal', async () => {
    // Arrange
    const connectingButtonText = 'Cancel Pairing';

    const pairFormParams = {
      acquirerCode: {
        value: 'test',
        option: TEXT_FORM_DEFAULT_VALUE,
        isValid: false,
      },
      addressType: 'auto',
      deviceAddress: {
        value: '',
        isValid: false,
      },
      posId: {
        value: 'test',
        isValid: false,
      },
      serialNumber: {
        value: mockTerminalInstanceId,
        isValid: false,
      },
      testMode: true,
    };

    // Act
    const mockContainer = setupContainer(
      pairFormParams,
      mockTerminalsConfigs({
        status: SPI_PAIR_STATUS.PairedConnecting,
        pairingFlow: mockPairingFlow,
      })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(connectingButtonText)).toBeTruthy();
  });

  test('should show Unpair button and Go to Sample POS link when terminal has been connected with Sample POS', () => {
    // Arrange
    const connectedButtonText = 'Unpair';
    const samplePosLinkText = 'Go to Sample POS';

    // Act
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({
        status: SPI_PAIR_STATUS.PairedConnected,
        pairingFlow: mockPairingFlow,
      })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(connectedButtonText, samplePosLinkText)).toBeTruthy();
  });

  test('should not any button when form is not completed', () => {
    // Arrange
    const pairFormParams = {
      acquirerCode: {
        value: 'test',
        option: TEXT_FORM_DEFAULT_VALUE,
        isValid: false,
      },
      addressType: 'eftpos',
      deviceAddress: {
        value: '',
        isValid: false,
      },
      posId: {
        value: '',
        isValid: false,
      },
      serialNumber: {
        value: '',
        isValid: false,
      },
      testMode: true,
    };
    const pairButtonId = 'pairBtn';

    // Act
    const mockContainer = setupContainer(pairFormParams);

    // Assert
    expect(mockContainer.innerHTML.includes(pairButtonId)).toBeFalsy();
  });
});
