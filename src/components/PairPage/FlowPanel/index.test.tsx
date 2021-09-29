import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import FlowPanel from '.';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockPairingFlow,
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

  return mockWithRedux(<FlowPanel flow />, customizedStore);
}

describe('Test <FlowPanel />', () => {
  let container: Any;

  beforeEach(() => {
    container = setupContainer();
  });

  afterEach(cleanup);

  test('should match FlowPanel snapshot test', () => {
    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should show paring flow params', () => {
    // Arrange
    const EFTPOS = defaultLocalIP;

    // Assert
    expect(container.innerHTML.includes(EFTPOS)).toBe(true);
  });

  test('show display pairingFLow flow message', () => {
    // Arrange
    const flowMessage = 'Requesting to Pair...';

    // Act
    // const mockContainer = setupContainer(defaultMockPairFormParams, mockTerminals);
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ pairingFlow: mockPairingFlow })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(flowMessage)).toBeTruthy();
  });

  test('show display pos version value', () => {
    // Arrange
    const mockPosVersion = 'v1.1.1';

    // Act
    // const mockContainer = setupContainer(defaultMockPairFormParams, mockTerminals);
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ posVersion: mockPosVersion })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(mockPosVersion)).toBeTruthy();
  });

  test('show display plugin version value', () => {
    // Arrange
    const mockPluginVersion = 'v2.2.2';

    // Act
    // const mockContainer = setupContainer(defaultMockPairFormParams, mockTerminals);
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({ pluginVersion: mockPluginVersion })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(mockPluginVersion)).toBeTruthy();
  });

  test('show display "-" value for pos version and plugin version when both values not available', () => {
    // Arrange
    const mockPosVersion = 'POS: -';
    const mockPluginVersion = 'Spi: -';

    // Assert
    expect(container.innerHTML.includes(mockPosVersion, mockPluginVersion)).toBeTruthy();
  });

  test('show display plugin version value', () => {
    // Arrange
    const mockPluginVersion = 'v2.2.3';
    const mockText = 'POS: - Spi: v2.2.3';

    // Act
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({
        posVersion: null,
        pluginVersion: mockPluginVersion,
      })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(mockText)).toBeTruthy();
  });

  test('show display plugin version value', () => {
    // Arrange
    const mockPosVersion = '1.1.3';
    const mockText = 'POS: v1.1.3 Spi: -';

    // Act
    const mockContainer = setupContainer(
      defaultMockPairFormParams,
      mockTerminalsConfigs({
        posVersion: mockPosVersion,
      })
    );

    // Assert
    expect(mockContainer.innerHTML.includes(mockText)).toBeTruthy();
  });
});
