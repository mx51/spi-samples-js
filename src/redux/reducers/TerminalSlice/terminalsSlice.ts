import { SpiStatus, SuccessState } from '@mx51/spi-client-js';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import {
  IAddTerminalAction,
  IBatteryLevel,
  IClearTransactionAction,
  IConfigurations,
  IRemoveTerminalAction,
  ITerminalState,
  ITxFlow,
  IUpdateDeviceAddressAction,
  IUpdatePairingFlowAction,
  IUpdatePairingStatusAction,
  IUpdateSettingAction,
  IUpdateTerminalReceipt,
  IUpdateTerminalSecretAction,
  IUpdateTerminalSerialNumberAction,
  IUpdateTxFlowAction,
  IUpdateTxMessage,
} from './interfaces';
import { TxLogService, TxLogServiceMapper } from '../../../services/txLogService';
import { addPreAuth, clearPreAuth, reducePreAuth, topupPreAuth } from '../PreAuth/preAuthSlice';

const terminalsSlice = createSlice({
  name: 'terminals',
  initialState: {},
  reducers: {
    resetTerminalsSlice() {
      return {};
    },
    addTerminal(state: ITerminalState, action: PayloadAction<IAddTerminalAction>) {
      const { id, terminalConfigs } = action.payload;

      state[id] = { ...terminalConfigs, reconnecting: false };
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

      // can also dispatch updatePairingStatus from spiService when below condition is true
      if (pairingFlow?.finished && !pairingFlow?.successful) currentState.status = SpiStatus.Unpaired;

      currentState.pairingFlow = pairingFlow;
      state[id] = currentState;
    },

    updatePairingStatus(state: ITerminalState, action: PayloadAction<IUpdatePairingStatusAction>) {
      const { id, status } = action.payload;
      const currentState = state[id] || {};

      if (
        currentState.status &&
        currentState.status === SPI_PAIR_STATUS.PairedConnected &&
        status === SPI_PAIR_STATUS.PairedConnecting
      ) {
        currentState.reconnecting = true;
      } else {
        currentState.reconnecting = false;
      }

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
      const { id, spiClient } = action.payload;

      state[id] = { ...spiClient, txFlow: state[id].txFlow };
    },

    updateTerminalConfigurations(state: ITerminalState, action: PayloadAction<IConfigurations>) {
      const { id, pluginVersion, merchantId, terminalId } = action.payload;

      state[id] = {
        ...state[id],
        pluginVersion,
        merchantId,
        terminalId,
      };
    },

    updateTerminalBatteryLevel(state: ITerminalState, action: PayloadAction<IBatteryLevel>) {
      const { id, batteryLevel } = action.payload;

      state[id] = {
        ...state[id],
        batteryLevel,
      };
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

    updateTxFlowSettlementResponse(state: ITerminalState, action: PayloadAction<IUpdateTerminalReceipt>) {
      const { id, receipt } = action.payload;
      const currentState = state[id] || {};

      currentState.receipt = receipt;
      state[id] = currentState;
    },

    updateTxFlow(state: ITerminalState, action: PayloadAction<IUpdateTxFlowAction>) {
      const { id, txFlow } = action.payload;
      const currentState = state[id] || {};
      if (txFlow.finished) {
        currentState.txMessage = null;
      }
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

const isCancelledTx = (txFlow: ITxFlow) => {
  const { cancelAttemptTime, success: successState, response } = txFlow;
  const txTimeOutOrCancelled =
    ['511', 'T201', 'T204', 'T200'].includes(response.data.hostResponseCode) || cancelAttemptTime;
  const terminalBusy = successState === SuccessState.Failed && !response.data.hostResponseCode;
  return txTimeOutOrCancelled || terminalBusy;
};

export const updateTxFlowWithSideEffect = createAsyncThunk(
  'terminals/updateTxFlowWithSideEffect',
  async (payload: IUpdateTxFlowAction, { dispatch, getState }) => {
    dispatch(terminalsSlice.actions.updateTxFlow(payload));
    const { id, txFlow } = payload;

    const { finished, response, posRefId, override, isGetTx } = txFlow;

    if (finished && isGetTx && isCancelledTx(txFlow)) {
      TxLogService.removeTx(posRefId);
    } else if (finished && (override || !isCancelledTx(txFlow))) {
      const { terminals } = getState() as Any;
      const { transactionType } = response.data;
      const { posId, merchantId: mid, terminalId: tid } = terminals[id];

      const txLogItem = TxLogServiceMapper.toTxLogItem({
        txFlow,
        posId,
        mid,
        tid,
      });

      if (isGetTx) {
        TxLogService.updateTx(txLogItem);

        const currentTerminal = terminals[id];
        const preAuthValues = {
          preAuth: {
            preAuthRef: currentTerminal?.txFlow?.response?.data?.preAuthId ?? '-',
            preAuthAmount: currentTerminal?.txFlow?.response?.data?.preAuthAmount ?? 0,
            topupAmount: currentTerminal?.txFlow?.response?.data?.topupAmount ?? 0,
            reduceAmount: currentTerminal?.txFlow?.response?.data?.reduceAmount ?? 0,
            surcharge: currentTerminal?.txFlow?.response?.data?.surchargeAmount ?? 0,
            verified: currentTerminal?.txFlow?.success === 'Success',
          },
        };
        if (transactionType === 'PRE-AUTH') {
          dispatch(addPreAuth(preAuthValues));
        }

        if (transactionType === 'TOPUP') {
          dispatch(topupPreAuth(preAuthValues));
        }

        if (transactionType === 'CANCEL') {
          dispatch(reducePreAuth(preAuthValues));
        }

        if (transactionType === 'PRE-AUTH CANCEL') {
          dispatch(clearPreAuth(preAuthValues));
        }

        if (transactionType === 'PCOMP') {
          dispatch(clearPreAuth(preAuthValues));
        }
      } else {
        TxLogService.saveAndDeleteYesterdayTx(txLogItem);
      }
    }
  }
);

export const {
  addTerminal,
  clearTransaction,
  removeTerminal,
  updateDeviceAddress,
  updatePairingFlow,
  updatePairingStatus,
  updateSetting,
  updateTerminal,
  updateTerminalConfigurations,
  updateTerminalBatteryLevel,
  updateTerminalSecret,
  updateTerminalSerialNumber,
  updateTxFlowSettlementResponse,
  updateTxFlow,
  updateTxMessage,
  resetTerminalsSlice,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
