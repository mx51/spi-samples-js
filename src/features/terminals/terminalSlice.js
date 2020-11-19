import { createSlice } from '@reduxjs/toolkit';
import SPI from '../../pages/Burger/spi';

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState: {
    activeTerminalId: 'test',
  },
  reducers: {
    addTerminal(state, action) {
      console.log('addTerminal action called', state, action);
      const { id, payload } = action.payload;

      return {
        ...state,
        [id]: {
          status: 'Unpaired',
          terminalStatus: 'Idle',
          terminalConfig: payload.terminalConfig,
        },
      };
    },
    updateTerminalConfig(state, action) {
      console.log('updateTerminalConfig', action, state);

      const { payload } = action;
      const { id: instanceId } = payload;

      return {
        ...state,
        [instanceId]: {
          terminalConfig: payload.terminalConfig,
        },
      };
    },
    updateTerminalSerialNumber(state, action) {
      console.log('updateTerminalSerialNumber', action, state);

      const { payload } = action;
      const { id: instanceId, serialNumber } = payload;
      const data = state[instanceId];
      data.terminalConfig = {
        ...state[instanceId].terminalConfig,
        serialNumber,
      };

      return state;
    },
    updatePairingStatus(state, action) {
      console.log('updatePairingStatus', action, state);
      const { payload } = action;
      const { id: instanceId, status } = payload;
      const data = state[instanceId];
      data.status = status;
      return state;
    },
  },
});

export const addTerminal = (config) => terminalsSlice.actions.addTerminal(SPI.spiceAddTerminal(config));

export const { updatePairingStatus, updateTerminalSerialNumber } = terminalsSlice.actions;

export default terminalsSlice.reducer;
