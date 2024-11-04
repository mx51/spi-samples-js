import { cleanup } from '@testing-library/react';
import { mockTerminalInstanceId } from '../../../utils/tests/common';
import { ISelectedTerminalState } from './interface';
import reducer, { updateSelectedTerminal } from './selectedTerminalSlice';
import { TerminalConnection } from '../../../transaction-handling/terminal-connection';

describe('Test selected terminals slice selectors', () => {
  afterEach(cleanup);

  test('should handle when terminal is selected', () => {
    // Arrange
    const previousState = {
      id: '',
      connection: 'local' as TerminalConnection,
    };
    const updateSelectedTerminalAction = { id: '111', connection: 'local' as TerminalConnection };

    // Assert
    expect(reducer(previousState, updateSelectedTerminal(updateSelectedTerminalAction))).toEqual({
      id: '111',
      connection: 'local',
    });
  });

  test('should return correct response when run updateSelectedTerminal()', () => {
    // Arrange
    const initialState: ISelectedTerminalState = { id: '', connection: 'local' };
    const result = {
      payload: { id: mockTerminalInstanceId, connection: 'local' },
      type: 'selectedTerminal/updateSelectedTerminal',
    };
    const expectedResponse = {
      id: mockTerminalInstanceId,
      connection: 'local',
    };

    // Assert
    expect(updateSelectedTerminal({ id: mockTerminalInstanceId, connection: 'local' })).toMatchObject(result);
    expect(reducer(initialState, updateSelectedTerminal({ id: mockTerminalInstanceId, connection: 'local' }))).toEqual(
      expectedResponse
    );
  });
});
