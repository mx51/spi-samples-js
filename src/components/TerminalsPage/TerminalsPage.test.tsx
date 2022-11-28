import React from 'react';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Terminals from '.';
import { defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, { defaultMockPairFormParams, defaultMockTerminals } from '../../utils/tests/common';

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = defaultMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      common: {},
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<Terminals />, customizedStore);
}

describe('Test <Terminals />', () => {
  let container: Any;
  afterEach(cleanup);

  beforeEach(() => {
    container = setupContainer();
  });

  test('should match TerminalsPage snapshot test', () => {
    // Assert
    expect(container).toMatchSnapshot();
  });

  test('should return a list of terminals', () => {
    // Arrange
    const terminalRecordKeywords: string[] = ['POS ID', 'Pairing status', 'EFTPOS address', 'Serial number'];

    // Assert
    for (let index = 0; index < terminalRecordKeywords.length; index += 1) {
      expect(container.innerHTML.includes(terminalRecordKeywords[index])).toBeTruthy();
    }
    expect(container.innerHTML.includes(defaultLocalIP)).toBeTruthy();
  });

  test('should return add pair terminals button when terminal list is empty', () => {
    // Arrange
    const mockContainer = mockWithRedux(<Terminals />);

    // Assert
    expect(mockContainer.innerHTML.includes('+ Pair terminal')).toBeTruthy();
    expect(mockContainer.innerHTML.includes(defaultLocalIP)).toBeFalsy();
  });
});
