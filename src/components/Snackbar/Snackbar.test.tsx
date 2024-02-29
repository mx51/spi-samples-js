import React from 'react';
import { cleanup } from '@testing-library/react';
import Snackbar from '.';
import mockWithRedux, { defaultMockPairFormParams } from '../../utils/tests/common';

describe('Test <Snackbar />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    const customizedStore = {
      getState: () => ({
        common: { showFlowPanel: false },
        pairForm: {
          ...defaultMockPairFormParams,
          error: {
            isShown: true,
            Message: 'Mock error message ..',
          },
        },
        terminals: {},
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };

    mockContainer = mockWithRedux(<Snackbar />, customizedStore);
  });

  afterEach(cleanup);

  test('should match Snackbar snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });
});
