import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITerminalState {
  [key: string]: {
    id: string;
    status: string | null;
    terminalStatus: string | null;
    flow: string | null;
    txFlow: null;
    pairingFlow: {
      Finished: boolean;
    };
    terminalConfig: ITerminalConfig | unknown;
  };
}

// Types for common interfaces
interface ITerminalConfig {
  posId: string;
  eftpos: string;
  autoAddress: boolean;
  serialNumber: string;
  testMode: boolean;
  secureWebSocket: boolean;
  apiKey: string;
}

// Types for Actions
interface IAddTerminalAction {
  id: string;
  payload: {
    status: string | null;
    terminalStatus: string | null;
    flow: string | null;
    txFlow: null;
    terminalConfig: ITerminalConfig | unknown;
  };
}

const initialState: ITerminalState = {};

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState,
  reducers: {
    addTerminal(state: ITerminalState, action: PayloadAction<IAddTerminalAction>) {
      const { id, payload } = action.payload;
      const data = state[id] || {};
      data.pairingFlow = data.pairingFlow || {};
      data.terminalConfig = data.terminalConfig || {};

      data.id = id;
      data.pairingFlow.Finished = true;
      data.terminalConfig = payload.terminalConfig;
      data.terminalStatus = payload.terminalStatus != null ? payload.terminalStatus : data.terminalStatus;
      data.status = payload.status != null ? payload.status : data.status;
      data.txFlow = payload.txFlow;
      state[id] = data;
    },
  },
});
export const { addTerminal } = terminalsSlice.actions;

export default terminalsSlice.reducer;
