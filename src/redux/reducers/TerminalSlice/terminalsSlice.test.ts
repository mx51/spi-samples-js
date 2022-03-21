import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { mockReceiptResponse } from '../../../utils/tests/common';
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
    finished: true,
    message: 'Requesting to pair ..',
    awaitingCheckFromEftpos: false,
    awaitingCheckFromPos: false,
    confirmationCode: '',
    successful: false,
  };

  return pairingFlow;
}

function mockDefaultTerminalConfigurations() {
  return {
    acquirerCode: 'string',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'string',
    posVersion: '',
    secureWebSocket: true,
    serialNumber: mockTerminalInstanceId,
    testMode: true,
    pairingFlow: null,
    pluginVersion: '-',
    merchantId: '-',
    terminalId: '-',
    batteryLevel: '-',
    flow: null,
    id: '',
    secrets: null,
    settings: null, // not available during pair terminal stage
    status: SPI_PAIR_STATUS.Unpaired,
    reconnecting: false,
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
      reconnecting: false,
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
        purchaseAmount: 0,
        surchargeAmount: 0,
        cashAmount: 0,
        tipAmount: 0,
      },
    },
    signatureRequiredMessage: {
      posRefId: 'string',
      requestId: 'string',
      receiptToSign: 'string',
    },
    request: {
      id: 'string',
      eventName: 'string',
      data: {
        posRefId: 'string',
        purchaseAmount: 0,
        tipAmount: 0,
        cashAmount: 0,
        promptForCashout: false,
        surchargeAmount: 0,
        promptForCustomerCopy: false,
        printForSignatureRequiredTransactions: false,
        printMerchantCopy: false,
        customerReceiptHeader: '',
        customerReceiptFooter: '',
        merchantReceiptHeader: '',
        merchantReceiptFooter: '',
      },
      posId: '',
      decryptedJson: '',
    },
  };
  return txFlow;
}

test('should handle a initial add terminal state', () => {
  // Arrange
  const previousState = {};
  const expectedState = {
    acquirerCode: 'string',
    autoAddress: false,
    deviceAddress: defaultLocalIP,
    posId: 'string',
    secureWebSocket: true,
    serialNumber: mockTerminalInstanceId,
    testMode: true,
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
    reconnecting: false,
    terminalStatus: '',
    txFlow: null,
    txMessage: null, // not available during pair terminal stage
  };

  // Act
  const addTerminalAction = {
    id: mockTerminalInstanceId,
    terminalConfigs: mockDefaultTerminalConfigurations(),
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
    terminalConfigs: mockDefaultTerminalConfigurations(),
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
    message: 'Connecting...',
    awaitingCheckFromEftpos: false,
    awaitingCheckFromPos: false,
    confirmationCode: '',
    finished: false,
    successful: false,
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
    message: 'Connecting...',
    awaitingCheckFromEftpos: false,
    awaitingCheckFromPos: false,
    confirmationCode: '',
    finished: false,
    successful: false,
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
    message: 'Connecting...',
    awaitingCheckFromEftpos: false,
    awaitingCheckFromPos: false,
    confirmationCode: '',
    finished: true,
    successful: false,
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
      reconnecting: false,
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
      acquirerCode: 'test',
      autoAddress: false,
      deviceAddress: defaultLocalIP,
      posId: 'test',
      secureWebSocket: true,
      serialNumber: mockTerminalInstanceId,
      testMode: true,
      flow: null,
      id: mockTerminalInstanceId,
      pairingFlow: null,
      posVersion: '1.3.4',
      secrets: {
        encKey: 'string',
        hmacKey: 'string',
      },
      settings: null, // not available during pair terminal stage
      status: 'Idle',
      terminalStatus: null,
      txFlow: null,
      txMessage: null,
    },
  };

  const expectedResponse = {
    acquirerCode: updateTerminalAction.spiClient.acquirerCode,
    autoAddress: updateTerminalAction.spiClient.autoAddress,
    deviceAddress: updateTerminalAction.spiClient.deviceAddress,
    posId: updateTerminalAction.spiClient.posId,
    secureWebSocket: updateTerminalAction.spiClient.secureWebSocket,
    serialNumber: updateTerminalAction.spiClient.serialNumber,
    testMode: updateTerminalAction.spiClient.testMode,
    flow: updateTerminalAction.spiClient.flow,
    id: updateTerminalAction.spiClient.id,
    pairingFlow: updateTerminalAction.spiClient.pairingFlow,
    posVersion: updateTerminalAction.spiClient.posVersion,
    secrets: updateTerminalAction.spiClient.secrets,
    settings: updateTerminalAction.spiClient.settings,
    status: updateTerminalAction.spiClient.status,
    terminalStatus: updateTerminalAction.spiClient.terminalStatus,
    txFlow: updateTerminalAction.spiClient.txFlow,
    txMessage: updateTerminalAction.spiClient.txMessage,
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
    decryptedJson: '',
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
    decryptedJson: '',
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
    receipt: mockReceiptResponse,
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
    receipt: mockReceiptResponse,
  };

  // Assert
  expect(reducer(previousState, updateTxFlowSettlementResponse(updateTxFlowSettlementResponseAction))).toEqual({
    [mockTerminalInstanceId]: {
      receipt: mockReceiptResponse,
    },
  });
});
