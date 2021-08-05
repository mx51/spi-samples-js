import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IAddTerminalAction,
  IRemoveTerminalAction,
  ITerminalState,
  IUpdateDeviceAddressAction,
  IUpdatePairingFlowAction,
  IUpdatePairingStatusAction,
} from './interfaces';

const initialState: ITerminalState = {};

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState,
  reducers: {
    addTerminal(state: ITerminalState, action: PayloadAction<IAddTerminalAction>) {
      const { id, terminal } = action.payload;
      const data = state[id] || {};
      data.pairingFlow = data.pairingFlow || {};
      data.terminalConfig = data.terminalConfig || {};

      data.id = id;
      data.pairingFlow.finished = true;
      data.terminalConfig = terminal.terminalConfig;
      data.terminalStatus = terminal.terminalStatus || data.terminalStatus;
      data.status = terminal.status || data.status;
      data.txFlow = terminal.txFlow;
      state[id] = data;
    },

    updateDeviceAddress(state: ITerminalState, action: PayloadAction<IUpdateDeviceAddressAction>) {
      const { id, eftpos } = action.payload;
      const data = state[id] || {};
      data.terminalConfig.eftpos = eftpos;
      state[id] = data;
    },

    updatePairingFlow(state: ITerminalState, action: PayloadAction<IUpdatePairingFlowAction>) {
      const { id, pairingFlow } = action.payload;
      const data = state[id] || {};
      data.pairingFlow = { ...pairingFlow };
      // can also dispatch updatePairingStatus from spiService when below condition is true
      if (pairingFlow.finished && !pairingFlow.successful) {
        // TODO: replace value with SpiStatus.Unpaired once library is imported
        data.status = 'Unpaired';
      }
      state[id] = data;
    },

    updatePairingStatus(state: ITerminalState, action: PayloadAction<IUpdatePairingStatusAction>) {
      const { id, status } = action.payload;
      const data = state[id] || {};
      data.status = status;
      state[id] = data;
    },

    removeTerminal(state: ITerminalState, action: PayloadAction<IRemoveTerminalAction>) {
      const { id } = action.payload;
      delete state[id];
    },
  },
});

export const { addTerminal, updateDeviceAddress, updatePairingFlow, updatePairingStatus, removeTerminal } =
  terminalsSlice.actions;

export default terminalsSlice.reducer;
