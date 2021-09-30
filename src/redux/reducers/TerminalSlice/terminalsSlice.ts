import { SpiStatus } from '@mx51/spi-client-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
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
      const { id, pairFormValues } = action.payload;
      const terminalConfigs = {
        acquirerCode: pairFormValues.acquirerCode,
        autoAddress: pairFormValues.autoAddress,
        deviceAddress: pairFormValues.deviceAddress,
        posId: pairFormValues.posId,
        secureWebSocket: true,
        serialNumber: pairFormValues.serialNumber,
        testMode: pairFormValues.testMode,
        pluginVersion: '-',
        merchantId: '-',
        terminalId: '-',
        batteryLevel: '-',
        flow: null,
        id: '',
        pairingFlow: null,
        posVersion: '',
        secrets: pairFormValues.secrets,
        settings: null, // not available during pair terminal stage
        status: SPI_PAIR_STATUS.Unpaired,
        terminalStatus: '',
        txFlow: null,
        txMessage: null, // not available during pair terminal stage
      };
      state[id] = terminalConfigs;
    },

    clearTransaction(state: ITerminalState, action: PayloadAction<IClearTransactionAction>) {
      const { id } = action.payload;
      const currentState = state[id] || {};
      currentState.txMessage = null;
      currentState.txFlow = null;
      state[id] = currentState;
    },

    removeTerminal(state: ITerminalState, action: PayloadAction<IRemoveTerminalAction>) {
      const { id } = action.payload;
      delete state[id];
    },

    updateDeviceAddress(state: ITerminalState, action: PayloadAction<IUpdateDeviceAddressAction>) {
      const { id, deviceAddress } = action.payload;
      const currentState = state[id] || {};
      currentState.deviceAddress = deviceAddress;
      state[id] = currentState;
    },

    updatePairingFlow(state: ITerminalState, action: PayloadAction<IUpdatePairingFlowAction>) {
      const { id, pairingFlow } = action.payload;
      const currentState = state[id] || {};
      currentState.pairingFlow = pairingFlow;

      // can also dispatch updatePairingStatus from spiService when below condition is true
      if (currentState.pairingFlow.Finished && !currentState.pairingFlow.Successful)
        currentState.status = SpiStatus.Unpaired;

      state[id] = currentState;
    },

    updatePairingStatus(state: ITerminalState, action: PayloadAction<IUpdatePairingStatusAction>) {
      const { id, status } = action.payload;
      const currentState = state[id] || {};

      if (!currentState.status) {
        currentState.status = SPI_PAIR_STATUS.PairedConnecting;
      } else {
        currentState.status = status;
      }
    },

    updateSetting(state: ITerminalState, action: PayloadAction<IUpdateSettingAction>) {
      const { id, settings } = action.payload;
      const currentState = state[id] || {};
      currentState.settings = settings;
      state[id] = currentState;
    },

    updateTerminal(state: ITerminalState, action: PayloadAction<Any>) {
      const { id, spiClient, pluginVersion, merchantId, terminalId, batteryLevel } = action.payload;

      const response = {
        acquirerCode: spiClient._acquirerCode,
        autoAddress: spiClient._autoAddressResolutionEnabled,
        deviceAddress: spiClient._eftposAddress,
        posId: spiClient._posId,
        secureWebSocket: spiClient._forceSecureWebSockets,
        serialNumber: spiClient._serialNumber,
        testMode: spiClient._inTestMode,
        pluginVersion: pluginVersion || '-',
        merchantId: merchantId || '-',
        terminalId: terminalId || '-',
        batteryLevel: batteryLevel || '-',
        flow: spiClient.CurrentFlow,
        id: spiClient._serialNumber,
        pairingFlow: spiClient.CurrentPairingFlowState,
        posVersion: spiClient._posVersion,
        secrets: spiClient._secrets,
        settings: null, // not available during pair terminal stage
        status: spiClient._currentStatus,
        terminalStatus: spiClient.CurrentFlow,
        txFlow: spiClient.CurrentTxFlowState,
        txMessage: null, // not available during pair terminal stage
      };

      state[id] = response;
    },

    updateTerminalSerialNumber(state: ITerminalState, action: PayloadAction<IUpdateTerminalSerialNumberAction>) {
      const { id, serialNumber } = action.payload;
      const currentState = state[id] || {};
      currentState.serialNumber = serialNumber;
      state[id] = currentState;
    },

    updateTerminalSecret(state: ITerminalState, action: PayloadAction<IUpdateTerminalSecretAction>) {
      const { id, secrets } = action.payload;
      const currentState = state[id] || {};
      currentState.secrets = secrets;
      state[id] = currentState;
    },

    updateTxFlow(state: ITerminalState, action: PayloadAction<IUpdateTxFlowAction>) {
      const { id, txFlow } = action.payload;
      const currentState = state[id] || {};
      currentState.txFlow = txFlow;
      state[id] = currentState;
    },

    updateTxMessage(state: ITerminalState, action: PayloadAction<IUpdateTxMessage>) {
      const { id, txMessage } = action.payload;
      const currentState = state[id] || {};
      currentState.txMessage = txMessage;
      state[id] = currentState;
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
  updateTerminal,
  updateTerminalSecret,
  updateTerminalSerialNumber,
  updateTxFlow,
  updateTxMessage,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
