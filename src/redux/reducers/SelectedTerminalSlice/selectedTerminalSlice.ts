import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISelectedTerminalState } from './interface';

const initialState: ISelectedTerminalState = { selectedTerminalId: '' };

const selectedTerminalSlice = createSlice({
  name: 'selectedTerminal',
  initialState,
  reducers: {
    updateSelectedTerminal(state: ISelectedTerminalState, action: PayloadAction<string>) {
      const terminalId = action.payload;

      state.selectedTerminalId = terminalId;
    },
  },
});

export const { updateSelectedTerminal } = selectedTerminalSlice.actions;

export default selectedTerminalSlice.reducer;
