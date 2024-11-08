import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISelectedTerminalState } from './interface';

const initialState: ISelectedTerminalState = { id: '', connection: 'local' };

const selectedTerminalSlice = createSlice({
  name: 'selectedTerminal',
  initialState,
  reducers: {
    updateSelectedTerminal(state: ISelectedTerminalState, action: PayloadAction<ISelectedTerminalState>) {
      state.id = action.payload.id;
      state.connection = action.payload.connection;
    },
  },
});

export const { updateSelectedTerminal } = selectedTerminalSlice.actions;

export default selectedTerminalSlice.reducer;
