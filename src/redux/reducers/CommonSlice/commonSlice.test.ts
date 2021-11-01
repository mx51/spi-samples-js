import { cleanup } from '@testing-library/react';
import reducer, { toggleFlowPanel } from './commonSlice';

describe('Test commonSlice', () => {
  afterEach(cleanup);

  test('test toggleFlowPanel()', () => {
    // Arrange
    const initialState = { showFlowPanel: false };
    const expectedResult = {
      showFlowPanel: true,
    };

    // Assert
    expect(reducer(initialState, toggleFlowPanel(true))).toMatchObject(expectedResult);
  });
});
