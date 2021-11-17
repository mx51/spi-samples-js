import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { mockReceiptRawResponse, mockReceiptResponse } from '../../../utils/tests/common';
import { IPairingFlow, IUpdateDeviceAddressAction, ITerminalState, ITxFlow } from './interfaces';
import reducer, {
  addTerminal,
  clearTransaction,
  removeTerminal,
  updateDeviceAddress,
  updatePairingFlow,
  updatePairingStatus,
  updateSetting,
  updateTerminal,
  updateTerminalBatteryLevel,
  updateTerminalConfigurations,
  updateTerminalSecret,
  updateTerminalSerialNumber,
  updateTxFlow,
  updateTxFlowSettlementResponse,
  updateTxMessage,
} from './terminalsSlice';

const mockTerminalInstanceId = '222-222-222';

function mockPairingFlow(): IPairingFlow {
  const pairingFlow = {
    Finished: true,
    Message: 'Requesting to pair ..',
    AwaitingCheckFromEftpos: false,
    AwaitingCheckFromPos: false,
    ConfirmationCode: '',
    Successful: false,
  };

  return pairingFlow;
}

function mockTerminalConfigurations() {
  return {
    acquirerCode: 'string',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'string',
    posVersion: '',
    secureWebSocket: true,
    serialNumber: mockTerminalInstanceId,
    testMode: true,
    pairingFlow: mockPairingFlow(),
    pluginVersion: '-',
    merchantId: '-',
    terminalId: '-',
    batteryLevel: '-',
    flow: null,
    id: '',
    secrets: null,
    settings: null, // not available during pair terminal stage
    status: SPI_PAIR_STATUS.Unpaired,
    terminalStatus: '',
    txFlow: null,
    txMessage: null, // not available during pair terminal stage
  };
}

function mockPreviousState(): ITerminalState {
  return {
    [mockTerminalInstanceId]: {
      acquirerCode: 'string',
      autoAddress: false,
      deviceAddress: defaultLocalIP,
      posId: 'string',
      secureWebSocket: true,
      serialNumber: mockTerminalInstanceId,
      testMode: true,
      pluginVersion: '-',
      posVersion: '1.2.3',
      merchantId: '-',
      terminalId: '-',
      batteryLevel: '-',
      flow: null,
      id: '',
      pairingFlow: mockPairingFlow(),
      secrets: null,
      settings: null,
      status: SPI_PAIR_STATUS.Unpaired,
      terminalStatus: '',
      txFlow: null,
      txMessage: null,
    },
  };
}

function mockTxFlow(): ITxFlow {
  const txFlow = {
    posRefId: 'string',
    id: 'string',
    type: 'string',
    displayMessage: 'string',
    amountCents: 100,
    awaitingSignatureCheck: true,
    finished: true,
    success: 'string',
    response: {
      data: {
        rrn: 'string',
        schemeAppName: 'string',
        schemeName: 'string',
        merchantReceipt: 'string',
        transactionType: 'string',
        hostResponseText: 'string',
      },
    },
    signatureRequiredMessage: 'string',
    request: {
      id: 'string',
      eventName: 'string',
      data: {
        posRefId: 'string',
        purchaseAmount: 1000,
        tipAmount: 0,
        cashAmount: 0,
        promptForCashout: false,
        surchargeAmount: 0,
        promptForCustomerCopy: true,
        printForSignatureRequiredTransactions: false,
        printMerchantCopy: false,
        customerReceiptHeader: 'string',
        customerReceiptFooter: 'string',
        merchantReceiptHeader: 'string',
        merchantReceiptFooter: 'string',
      },
      posId: 'string',
      decryptedJson: 'string',
    },
  };
  return txFlow;
}

test('should handle a initial add terminal state', () => {
  // Arrange
  const previousState = {};
  const pairFormValues = {
    acquirerCode: 'test',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'test',
    secrets: null,
    serialNumber: mockTerminalInstanceId,
    testMode: false,
  };
  const expectedState = {
    acquirerCode: 'test',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'test',
    secureWebSocket: true,
    serialNumber: mockTerminalInstanceId,
    testMode: false,
    pluginVersion: '-',
    merchantId: '-',
    terminalId: '-',
    batteryLevel: '-',
    flow: null,
    id: '',
    pairingFlow: null,
    posVersion: '',
    secrets: null,
    settings: null, // not available during pair terminal stage
    status: SPI_PAIR_STATUS.Unpaired,
    terminalStatus: '',
    txFlow: null,
    txMessage: null, // not available during pair terminal stage
  };

  // Act
  const addTerminalAction = {
    id: mockTerminalInstanceId,
    pairFormValues,
  };

  // Assert
  expect(reducer(previousState, addTerminal(addTerminalAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...expectedState,
    },
  });
});

test('should handle when terminal is added', () => {
  // Act
  const addTerminalAction = {
    id: mockTerminalInstanceId,
    pairFormValues: mockTerminalConfigurations(),
  };

  // Assert
  expect(reducer(mockPreviousState(), addTerminal(addTerminalAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      pairingFlow: null,
      posVersion: '',
    },
  });
});

test('should handle updateDeviceAddress', () => {
  // Act
  const updateDeviceAddressAction: IUpdateDeviceAddressAction = {
    id: mockTerminalInstanceId,
    deviceAddress: `${mockTerminalInstanceId}.mx51.test.link`,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateDeviceAddress(updateDeviceAddressAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      deviceAddress: `${mockTerminalInstanceId}.mx51.test.link`,
    },
  });
});

test('should handle updateDeviceAddress for empty state', () => {
  // Arrange
  const previousState = {};

  // Act
  const updateDeviceAddressAction: IUpdateDeviceAddressAction = {
    id: mockTerminalInstanceId,
    deviceAddress: `${mockTerminalInstanceId}.mx51.test.link`,
  };

  // Assert
  expect(reducer(previousState, updateDeviceAddress(updateDeviceAddressAction))).toEqual({
    [mockTerminalInstanceId]: {
      deviceAddress: `${mockTerminalInstanceId}.mx51.test.link`,
    },
  });
});

test('should handle updatePairingFlow', () => {
  // Arrange
  const mockPairingFlowResponse = {
    Message: 'Connecting...',
    AwaitingCheckFromEftpos: false,
    AwaitingCheckFromPos: false,
    ConfirmationCode: '',
    Finished: false,
    Successful: false,
  };

  // Act
  const updatePairingFlowAction = {
    id: mockTerminalInstanceId,
    pairingFlow: mockPairingFlowResponse,
  };

  // Assert
  expect(reducer(mockPreviousState(), updatePairingFlow(updatePairingFlowAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      pairingFlow: mockPairingFlowResponse,
    },
  });
});

test('should handle updatePairingFlow when empty state & unpaired', () => {
  // Arrange
  const mockPairingFlowResponse = {
    Message: 'Connecting...',
    AwaitingCheckFromEftpos: false,
    AwaitingCheckFromPos: false,
    ConfirmationCode: '',
    Finished: false,
    Successful: false,
  };
  const previousState = {};

  // Act
  const updatePairingFlowAction = {
    id: mockTerminalInstanceId,
    pairingFlow: mockPairingFlowResponse,
  };

  // Assert
  expect(reducer(previousState, updatePairingFlow(updatePairingFlowAction))).toEqual({
    [mockTerminalInstanceId]: {
      pairingFlow: mockPairingFlowResponse,
    },
  });
});

test('should handle updatePairingFlow when empty state & unpaired', () => {
  // Arrange
  const mockPairingFlowResponse = {
    Message: 'Connecting...',
    AwaitingCheckFromEftpos: false,
    AwaitingCheckFromPos: false,
    ConfirmationCode: '',
    Finished: true,
    Successful: false,
  };
  const previousState = {};

  // Act
  const updatePairingFlowAction = {
    id: mockTerminalInstanceId,
    pairingFlow: mockPairingFlowResponse,
    status: undefined,
  };

  // Assert
  expect(reducer(previousState, updatePairingFlow(updatePairingFlowAction))).toMatchObject({
    [mockTerminalInstanceId]: {
      pairingFlow: mockPairingFlowResponse,
      status: SPI_PAIR_STATUS.Unpaired,
    },
  });
});

test('should handle updatePairingStatus', () => {
  // Act
  const updatePairingStatusAction = {
    id: mockTerminalInstanceId,
    status: SPI_PAIR_STATUS.PairedConnected,
  };

  // Assert
  expect(reducer(mockPreviousState(), updatePairingStatus(updatePairingStatusAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      status: SPI_PAIR_STATUS.PairedConnected,
    },
  });
});

test('should show PairedConnecting as status if no status value setup in updatePairingStatus()', () => {
  // Act
  const previousState = {
    [mockTerminalInstanceId]: {
      status: null,
    },
  };

  const updatePairingStatusAction = {
    id: mockTerminalInstanceId,
    status: SPI_PAIR_STATUS.Unpaired,
  };

  // Assert
  expect(reducer(previousState as Any, updatePairingStatus(updatePairingStatusAction))).toEqual({
    [mockTerminalInstanceId]: {
      status: SPI_PAIR_STATUS.PairedConnecting,
    },
  });
});

test('should handle removeTerminal', () => {
  // Act
  const removeTerminalAction = {
    id: mockTerminalInstanceId,
  };

  // Assert
  expect(reducer(mockPreviousState(), removeTerminal(removeTerminalAction))).toEqual({});
});

test('should handle updateTerminalSerialNumber', () => {
  // Act
  const updateTerminalSerialNumberAction = {
    id: mockTerminalInstanceId,
    serialNumber: mockTerminalInstanceId,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTerminalSerialNumber(updateTerminalSerialNumberAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      serialNumber: mockTerminalInstanceId,
    },
  });
});

test('should handle updateTerminalSerialNumber for empty state', () => {
  // Arrange
  const previousState = {};

  // Act
  const updateTerminalSerialNumberAction = {
    id: mockTerminalInstanceId,
    serialNumber: mockTerminalInstanceId,
  };

  // Assert
  expect(reducer(previousState, updateTerminalSerialNumber(updateTerminalSerialNumberAction))).toEqual({
    [mockTerminalInstanceId]: {
      serialNumber: mockTerminalInstanceId,
    },
  });
});

test('should handle updateTerminal', () => {
  // Arrange
  const updateTerminalAction = {
    id: mockTerminalInstanceId,
    spiClient: {
      _acquirerCode: 'test',
      _autoAddressResolutionEnabled: false,
      _eftposAddress: defaultLocalIP,
      _posId: 'test',
      _forceSecureWebSockets: true,
      _serialNumber: mockTerminalInstanceId,
      _inTestMode: true,
      CurrentFlow: null,
      CurrentPairingFlowState: null,
      _posVersion: '1.3.4',
      _secrets: {
        encKey: 'string',
        hmacKey: 'string',
      },
      _currentStatus: 'Idle',
      CurrentTxFlowState: null,
    },
  };

  const expectedResponse = {
    acquirerCode: updateTerminalAction.spiClient._acquirerCode,
    autoAddress: updateTerminalAction.spiClient._autoAddressResolutionEnabled,
    deviceAddress: updateTerminalAction.spiClient._eftposAddress,
    posId: updateTerminalAction.spiClient._posId,
    secureWebSocket: updateTerminalAction.spiClient._forceSecureWebSockets,
    serialNumber: updateTerminalAction.spiClient._serialNumber,
    testMode: updateTerminalAction.spiClient._inTestMode,
    flow: updateTerminalAction.spiClient.CurrentFlow,
    id: updateTerminalAction.spiClient._serialNumber,
    pairingFlow: updateTerminalAction.spiClient.CurrentPairingFlowState,
    posVersion: updateTerminalAction.spiClient._posVersion,
    secrets: updateTerminalAction.spiClient._secrets,
    settings: null, // not available during pair terminal stage
    status: updateTerminalAction.spiClient._currentStatus,
    terminalStatus: updateTerminalAction.spiClient.CurrentFlow,
    txFlow: updateTerminalAction.spiClient.CurrentTxFlowState,
    txMessage: null,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTerminal(updateTerminalAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...expectedResponse,
    },
  });
});

test('should handle updateTerminalSecret', () => {
  // Act
  const updateTerminalSecretAction = {
    id: mockTerminalInstanceId,
    secrets: {
      encKey: '123435u4758475848y8466666',
      hmacKey: '64736574hfrtu437777777',
    },
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTerminalSecret(updateTerminalSecretAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      secrets: {
        encKey: '123435u4758475848y8466666',
        hmacKey: '64736574hfrtu437777777',
      },
    },
  });
});

test('should handle updateTerminalSecret for empty state', () => {
  // Arrange
  const previousState = {};

  // Act
  const updateTerminalSecretAction = {
    id: mockTerminalInstanceId,
    secrets: {
      encKey: '123435u4758475848y8466666',
      hmacKey: '64736574hfrtu437777777',
    },
  };

  // Assert
  expect(reducer(previousState, updateTerminalSecret(updateTerminalSecretAction))).toEqual({
    [mockTerminalInstanceId]: {
      secrets: {
        encKey: '123435u4758475848y8466666',
        hmacKey: '64736574hfrtu437777777',
      },
    },
  });
});

test('should handle clearTransaction', () => {
  const clearTransactionAction = {
    id: mockTerminalInstanceId,
  };

  expect(reducer(mockPreviousState(), clearTransaction(clearTransactionAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
    },
  });
});

test('should handle clearTransaction for empty state', () => {
  // Arrange
  const previousState = {};

  // Act
  const clearTransactionAction = {
    id: mockTerminalInstanceId,
  };

  // Assert
  expect(reducer(previousState, clearTransaction(clearTransactionAction))).toEqual({
    [mockTerminalInstanceId]: {
      txMessage: null,
      txFlow: null,
    },
  });
});

test('should handle updateTxFlow', () => {
  // Act
  const updateTxFlowAction = {
    id: mockTerminalInstanceId,
    txFlow: mockTxFlow(),
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTxFlow(updateTxFlowAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      txFlow: mockTxFlow(),
    },
  });
});

test('should handle updateTxFlow for empty state', () => {
  // Arrange
  const previousState = {};

  // Act
  const updateTxFlowAction = {
    id: mockTerminalInstanceId,
    txFlow: mockTxFlow(),
  };

  // Assert
  expect(reducer(previousState, updateTxFlow(updateTxFlowAction))).toEqual({
    [mockTerminalInstanceId]: {
      txFlow: mockTxFlow(),
    },
  });
});

test('should handle updateSetting', () => {
  // Arrange
  const mockSettings = {
    eftposReceipt: true,
    sigFlow: true,
    printMerchantCopy: true,
    suppressMerchantPassword: true,
    receiptHeader: '',
    receiptFooter: '',
  };

  // Act
  const updateSettingAction = {
    id: mockTerminalInstanceId,
    settings: mockSettings,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateSetting(updateSettingAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      settings: mockSettings,
    },
  });
});

test('should handle updateSetting for empty state', () => {
  // Arrange
  const previousState = {};
  const mockSettings = {
    eftposReceipt: true,
    sigFlow: true,
    printMerchantCopy: true,
    suppressMerchantPassword: true,
    receiptHeader: '',
    receiptFooter: '',
  };

  // Act
  const updateSettingAction = {
    id: mockTerminalInstanceId,
    settings: mockSettings,
  };

  // Assert
  expect(reducer(previousState, updateSetting(updateSettingAction))).toEqual({
    [mockTerminalInstanceId]: {
      settings: mockSettings,
    },
  });
});

test('should handle updateTxMessage', () => {
  // Arrange
  const mockTxMessageResponse = {
    displayMessageCode: 4,
    displayMessageText: 'Waiting for customer to enter tip',
    posRefId: 'purchase-2021-08-09T12:10:00.461Z',
    posCounter: '',
    decryptedJson:
      '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
  };

  // Act
  const updateTxMessageAction = {
    id: mockTerminalInstanceId,
    txMessage: mockTxMessageResponse,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTxMessage(updateTxMessageAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      txMessage: mockTxMessageResponse,
    },
  });
});

test('should handle updateTxMessage for empty state', () => {
  // Arrange
  const previousState = {};
  const mockTxMessageResponse = {
    displayMessageCode: 4,
    displayMessageText: 'Waiting for customer to enter tip',
    posRefId: 'purchase-2021-08-09T12:10:00.461Z',
    posCounter: '',
    decryptedJson:
      '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
  };

  // Act
  const updateTxMessageAction = {
    id: mockTerminalInstanceId,
    txMessage: mockTxMessageResponse,
  };

  // Assert
  expect(reducer(previousState, updateTxMessage(updateTxMessageAction))).toEqual({
    [mockTerminalInstanceId]: {
      txMessage: mockTxMessageResponse,
    },
  });
});

test('should handle updateTerminalConfigurations', () => {
  // Arrange
  const updateTerminalConfigurationsAction = {
    id: mockTerminalInstanceId,
    pluginVersion: '11.2.3',
    merchantId: '123456789',
    terminalId: '987654321',
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTerminalConfigurations(updateTerminalConfigurationsAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      pluginVersion: '11.2.3',
      merchantId: '123456789',
      terminalId: '987654321',
    },
  });
});

test('should handle updateTerminalBatteryLevel', () => {
  // Arrange
  const updateTerminalBatteryLevelAction = {
    id: mockTerminalInstanceId,
    batteryLevel: '80',
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTerminalBatteryLevel(updateTerminalBatteryLevelAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      batteryLevel: '80',
    },
  });
});

test('should handle updateTxFlowSettlementResponse', () => {
  // Arrange
  const updateTxFlowSettlementResponseAction = {
    id: mockTerminalInstanceId,
    responseData: mockReceiptRawResponse,
  };

  // Assert
  expect(reducer(mockPreviousState(), updateTxFlowSettlementResponse(updateTxFlowSettlementResponseAction))).toEqual({
    [mockTerminalInstanceId]: {
      ...mockPreviousState()[mockTerminalInstanceId],
      receipt: mockReceiptResponse,
    },
  });
});

test('should handle updateTxFlowSettlementResponse for empty state', () => {
  // Arrange
  const previousState = {};
  const updateTxFlowSettlementResponseAction = {
    id: mockTerminalInstanceId,
    responseData: mockReceiptRawResponse,
  };

  // Assert
  expect(reducer(previousState, updateTxFlowSettlementResponse(updateTxFlowSettlementResponseAction))).toEqual({
    [mockTerminalInstanceId]: {
      receipt: mockReceiptResponse,
    },
  });
});
