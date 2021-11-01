import { cleanup } from '@testing-library/react';
import {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockDefaultProducts,
  mockTerminalInstanceId,
} from '../../../utils/tests/common';
import { terminalList, terminalInstance, isTerminalUnpaired } from './terminalsSliceSelectors';

const mockStoreState = {
  common: {
    showFlowPanel: false,
  },
  pairForm: defaultMockPairFormParams,
  products: mockDefaultProducts,
  terminals: defaultMockTerminals,
};

describe('Test terminals slice selectors', () => {
  afterEach(cleanup);

  test('Test terminalList', () => {
    // Assert
    expect(terminalList(mockStoreState)).toMatchObject(mockStoreState.terminals);
  });

  test('Test terminalInstance', () => {
    // Act
    const actualResult = (terminalInstance(mockTerminalInstanceId) as Any).resultFunc(terminalList(mockStoreState));

    // Assert
    expect(actualResult).toMatchObject(mockStoreState.terminals[mockTerminalInstanceId]);
  });

  test('Test isTerminalUnpaired', () => {
    // Act
    const actualResult = (isTerminalUnpaired(mockTerminalInstanceId) as Any).resultFunc(
      terminalInstance(mockTerminalInstanceId)
    );

    // Assert
    expect(actualResult).toBeFalsy();
  });
});
