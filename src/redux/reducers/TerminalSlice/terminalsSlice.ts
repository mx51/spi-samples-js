import { SpiStatus } from '@mx51/spi-client-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IAddTerminalAction,
  IClearTransactionAction,
  IRemoveTerminalAction,
  ITerminalState,
  IUpdateDeviceAddressAction,
  IUpdatePairingFlowAction,
  IUpdatePairingStatusAction,
  IUpdateSettingAction,
  IUpdateTerminalSecretAction,
  IUpdateTerminalSerialNumberAction,
  IUpdateTxFlowAction,
  IUpdateTxMessage,
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
      const { id, deviceAddress } = action.payload;
      const data = state[id] || {};
      data.terminalConfig = data.terminalConfig || {};
      data.terminalConfig.deviceAddress = deviceAddress;
      state[id] = data;
    },

    updatePairingFlow(state: ITerminalState, action: PayloadAction<IUpdatePairingFlowAction>) {
      const { id, pairingFlow } = action.payload;
      const data = state[id] || {};
      data.pairingFlow = pairingFlow;
      // can also dispatch updatePairingStatus from spiService when below condition is true
      if (pairingFlow.finished && !pairingFlow.successful) {
        data.status = SpiStatus.Unpaired;
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

    updateTerminalSerialNumber(state: ITerminalState, action: PayloadAction<IUpdateTerminalSerialNumberAction>) {
      const { id, serialNumber } = action.payload;
      const data = state[id] || {};
      data.terminalConfig = data.terminalConfig || {};
      data.terminalConfig.serialNumber = serialNumber;
      state[id] = data;
    },

    updateTerminalSecret(state: ITerminalState, action: PayloadAction<IUpdateTerminalSecretAction>) {
      const { id, secret } = action.payload;
      const data = state[id] || {};
      data.secret = secret;
      state[id] = data;
    },

    clearTransaction(state: ITerminalState, action: PayloadAction<IClearTransactionAction>) {
      const { id } = action.payload;
      const data = state[id] || {};
      data.txMessage = null;
      data.txFlow = null;
      state[id] = data;
    },

    updateTxFlow(state: ITerminalState, action: PayloadAction<IUpdateTxFlowAction>) {
      const { id, txFlow } = action.payload;
      const data = state[id] || {};
      data.txFlow = txFlow;
      state[id] = data;
    },

    updateSetting(state: ITerminalState, action: PayloadAction<IUpdateSettingAction>) {
      const { id, settings } = action.payload;
      const data = state[id] || {};
      data.settings = settings;
      state[id] = data;
    },

    updateTxMessage(state: ITerminalState, action: PayloadAction<IUpdateTxMessage>) {
      const { id, txMessage } = action.payload;
      const data = state[id] || {};
      data.txMessage = txMessage;
      state[id] = data;
    },
  },
});

export const {
  addTerminal,
  clearTransaction,
  removeTerminal,
  updateDeviceAddress,
  updatePairingFlow,
  updatePairingStatus,
  updateSetting,
  updateTerminalSecret,
  updateTerminalSerialNumber,
  updateTxFlow,
  updateTxMessage,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
