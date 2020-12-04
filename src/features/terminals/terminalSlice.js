import { createSlice } from '@reduxjs/toolkit';
import { SpiStatus, TransactionType } from '@mx51/spi-client-js';
import SPI from '../../pages/Burger/spi';

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState: {},
  reducers: {
    addTerminal(state, action) {
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
      const { payload } = action;
      const { id: instanceId, status } = payload;
      const data = state[instanceId];
      data.status = status;
      return state;
    },
    updatePairingFlow(state, action) {
      const { id, payload } = action.payload;
      const data = state[id];
      data.pairingFlow = { ...payload };
      return state;
    },
    removeTerminal(state, action) {
      const { id } = action.payload;
      const { [id]: terminal, ...data } = state;
      return data;
    },
    updateActiveTerminal(state, action) {
      const instanceId = action.payload;
      const data = state;
      data.activeTerminalId = instanceId;
      return data;
    },
    updateTxFlow(state, action) {
      const { id, payload } = action.payload;

      const txFlow = payload || {};
      const { Type } = payload;
      const isSettlement = [TransactionType.Settle, TransactionType.SettlementEnquiry].includes(Type);

      return {
        ...state,
        [id]: {
          ...state[id],
          txFlow,
          lastSettlement: isSettlement ? txFlow : state[id].lastSettlement,
        },
      };
    },
    updateTxMessage(state, action) {
      console.log('reducer updateTxMessage', state, action);
      const { id, payload } = action.payload;
      const data = state[id];
      data.txMessage = payload.payload.Data;
      return state;
    },
  },
});

export const addTerminal = () => terminalsSlice.actions.addTerminal(SPI.spiAddTerminal());
export const pairTerminal = (id, config) => terminalsSlice.actions.addTerminal(SPI.spiPairTerminal(id, config));
export const unpairTerminal = (id) => terminalsSlice.actions.updatePairingFlow(SPI.spiUnpairTerminal(id));
export const removeTerminal = (id) => terminalsSlice.actions.removeTerminal(SPI.spiRemoveTerminal(id));
export const cancelTerminalPairing = (id) => terminalsSlice.actions.updatePairingFlow(SPI.spiCancelPairingTerminal(id));

export const {
  updatePairingStatus,
  updateTerminalSerialNumber,
  updateActiveTerminal,
  updatePairingFlow,
  updateTxFlow,
  updateTxMessage,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
