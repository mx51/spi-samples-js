import { cleanup } from '@testing-library/react';
import { defaultMockCommonState } from '../../../utils/tests/common';
import reducer, { setConfirmPairingFlow, toggleFlowPanel } from './commonSlice';

describe('Test commonSlice', () => {
  afterEach(cleanup);

  test('test setConfirmPairingFlow()', () => {
    // Arrange
    const expectedResult = {
      showFlowPanel: false,
      acquireConfirmPairingFlow: true,
    };

    // Assert
    expect(reducer(defaultMockCommonState, setConfirmPairingFlow(true))).toMatchObject(expectedResult);
  });

  test('test toggleFlowPanel()', () => {
    // Arrange
    const expectedResult = {
      showFlowPanel: true,
      acquireConfirmPairingFlow: false,
    };

    // Assert
    expect(reducer(defaultMockCommonState, toggleFlowPanel(true))).toMatchObject(expectedResult);
  });
});
