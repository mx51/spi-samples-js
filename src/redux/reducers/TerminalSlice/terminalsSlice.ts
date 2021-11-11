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
  IUpdateTerminalReceipt,
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
      if (pairingFlow.Finished && !pairingFlow.Successful) currentState.status = SpiStatus.Unpaired;

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
      const { id, spiClient } = action.payload;

      const response = {
        acquirerCode: spiClient._acquirerCode,
        autoAddress: spiClient._autoAddressResolutionEnabled,
        deviceAddress: spiClient._eftposAddress,
        posId: spiClient._posId,
        secureWebSocket: spiClient._forceSecureWebSockets,
        serialNumber: spiClient._serialNumber,
        testMode: spiClient._inTestMode,
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

    updateTerminalConfigurations(state: ITerminalState, action: PayloadAction<Any>) {
      const { id, pluginVersion, merchantId, terminalId } = action.payload;

      state[id] = {
        ...state[id],
        pluginVersion,
        merchantId,
        terminalId,
      };
    },

    updateTerminalBatteryLevel(state: ITerminalState, action: PayloadAction<Any>) {
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

    updateTxFlowResponse(state: ITerminalState, action: PayloadAction<IUpdateTerminalReceipt>) {
      const { id, responseData } = action.payload;
      const currentState = state[id] || {};

      currentState.receipt = {
        accumulatedSettleByAcquirerCount: responseData?.accumulated_settle_by_acquirer_count,
        accumulatedSettleByAcquirerValue: responseData?.accumulated_settle_by_acquirer_value,
        accumulatedTotalCount: responseData?.accumulated_total_count,
        accumulatedTotalValue: responseData?.accumulated_total_value,
        bankDate: responseData?.bank_date,
        bankTime: responseData?.bank_time,
        errorDetail: responseData?.error_detail,
        errorReason: responseData?.error_reason,
        hostResponseCode: responseData?.host_response_code,
        hostResponseText: responseData?.host_response_text,
        merchantAcquirer: responseData?.merchant_acquirer,
        merchantAddress: responseData?.merchant_address,
        merchantCity: responseData?.merchant_city,
        merchantCountry: responseData?.merchant_country,
        merchantName: responseData?.merchant_name,
        merchantPostcode: responseData?.merchant_postcode,
        merchantReceipt: responseData?.merchant_receipt,
        merchantReceiptPrinted: responseData?.merchant_receipt_printed,
        schemes: responseData?.schemes,
        settlementPeriodEndDate: responseData?.settlement_period_end_date,
        settlementPeriodEndTime: responseData?.settlement_period_end_time,
        settlementPeriodStartDate: responseData?.settlement_period_start_date,
        settlementPeriodStartTime: responseData?.settlement_period_start_time,
        settlementTriggeredDate: responseData?.settlement_triggered_date,
        settlementTriggeredTime: responseData?.settlement_triggered_time,
        stan: responseData?.stan,
        success: responseData?.success,
        terminalId: responseData?.terminal_id,
        transactionRange: responseData?.transaction_range,
      };

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
  updateTerminalConfigurations,
  updateTerminalBatteryLevel,
  updateTerminalSecret,
  updateTerminalSerialNumber,
  updateTxFlowResponse,
  updateTxFlow,
  updateTxMessage,
} = terminalsSlice.actions;

export default terminalsSlice.reducer;
