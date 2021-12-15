import { cleanup } from '@testing-library/react';
import { mockTerminalInstanceId } from '../../../utils/tests/common';
import { ISelectedTerminalState } from './interface';
import reducer, { updateSelectedTerminal } from './selectedTerminalSlice';

describe('Test selected terminals slice selectors', () => {
  afterEach(cleanup);

  test('should handle when terminal is selected', () => {
    // Arrange
    const previousState = {
      selectedTerminalId: '',
    };
    const updateSelectedTerminalAction = '111';

    // Assert
    expect(reducer(previousState, updateSelectedTerminal(updateSelectedTerminalAction))).toEqual({
      selectedTerminalId: '111',
    });
  });

  test('should return correct response when run updateSelectedTerminal()', () => {
    // Arrange
    const initialState: ISelectedTerminalState = { selectedTerminalId: '' };
    const result = { payload: mockTerminalInstanceId, type: 'selectedTerminal/updateSelectedTerminal' };
    const expectedResponse = {
      selectedTerminalId: mockTerminalInstanceId,
    };

    // Assert
    expect(updateSelectedTerminal(mockTerminalInstanceId)).toMatchObject(result);
    expect(reducer(initialState, updateSelectedTerminal(mockTerminalInstanceId))).toEqual(expectedResponse);
  });
});
