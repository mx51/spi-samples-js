import { createSlice } from '@reduxjs/toolkit';
import { SpiStatus } from '@mx51/spi-client-js';
import SPI from '../../pages/Burger/spi';

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState: {},
  reducers: {
    addTerminal(state, action) {
      console.log('addTerminal action called', state, action);
      const { id, payload } = action.payload;

      return {
        ...state,
        activeTerminalId: id,
        [id]: {
          id,
          status: SpiStatus.Unpaired,
          terminalStatus: 'Idle',
          terminalConfig: payload ? payload.terminalConfig : {},
          pairingFlow: {
            Finished: true,
          },
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
    updatePairingFlow(state, action) {
      console.log('updatePairingFlow', action);
      const { id, payload } = action.payload;
      const data = state[id];
      data.pairingFlow = { ...payload };
      return state;
    },
    removeTerminal(state, action) {
      console.log('removeTerminal', state, action);
      const { id } = action.payload;
      const { [id]: terminal, ...data } = state;
      console.log('new state', data);
      return data;
    },
    updateActiveTerminal(state, action) {
      console.log('updateActiveTerminal', action);
      const { id: instanceId } = action.payload;
      const data = state;
      data.activeTerminalId = instanceId;
      // if (instanceId) data[instanceId] = {};
      return data;
    },
  },
});

export const addTerminal = () => terminalsSlice.actions.addTerminal(SPI.spiAddTerminal());
export const pairTerminal = (id, config) => terminalsSlice.actions.addTerminal(SPI.spiPairTerminal(id, config));
export const unpairTerminal = (id) => terminalsSlice.actions.updatePairingFlow(SPI.spiUnpairTerminal(id));
export const removeTerminal = (id) => terminalsSlice.actions.removeTerminal(SPI.spiRemoveTerminal(id));

export const {
  updatePairingStatus,
  updateTerminalSerialNumber,
  updateActiveTerminal,
  updatePairingFlow,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
