import { cleanup } from '@testing-library/react';
import { defaultMockPairFormParams, defaultMockTerminals } from '../../../utils/tests/common';
import selectedShowFlowPanel from './commonSliceSelectors';

describe('Test CommonSelectors', () => {
  let mockStoreState: Any;

  afterEach(cleanup);

  beforeEach(() => {
    mockStoreState = {
      common: { showFlowPanel: false },
      pairForm: defaultMockPairFormParams,
      products: {
        tipAmount: 0,
        cashoutAmount: 0,
        surchargeAmount: 0,
        products: [],
      },
      terminals: defaultMockTerminals,
    };
  });

  test('should get showFlowPanel value as false', () => {
    // Assert
    expect(selectedShowFlowPanel(mockStoreState)).toBeFalsy();
  });

  test('should get showFlowPanel value as true', () => {
    // Arrange
    mockStoreState = {
      ...mockStoreState,
      common: {
        showFlowPanel: true,
      },
    };

    // Assert
    expect(selectedShowFlowPanel(mockStoreState)).toBeTruthy();
  });
});
