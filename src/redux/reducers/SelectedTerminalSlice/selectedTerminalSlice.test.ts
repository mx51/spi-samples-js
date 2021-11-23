import reducer, { updateSelectedTerminal } from './selectedTerminalSlice';

const previousState = {
  selectedTerminalId: '',
};

test('should handle when terminal is selected', () => {
  // Act
  const updateSelectedTerminalAction = '111';

  // Assert
  expect(reducer(previousState, updateSelectedTerminal(updateSelectedTerminalAction))).toEqual({
    selectedTerminalId: '111',
  });
});
