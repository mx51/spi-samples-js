import { IPairingFlow, ITxFlow } from './interfaces';
import reducer, {
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
} from './terminalsSlice';

function dummyPairingFlow(): IPairingFlow {
  const pairingFlow = {
    message: 'Pairing Successful!',
    awaitingCheckFromEftpos: false,
    awaitingCheckFromPos: false,
    confirmationCode: '4D6468',
    finished: true,
    successful: true,
  };
  return pairingFlow;
}

function dummyTxFlow(): ITxFlow {
  const txFlow = {
    posRefId: 'string',
    id: 'string',
    type: 'string',
    displayMessage: 'string',
    amountCents: 100,
    awaitingSignatureCheck: true,
    finished: true,
    success: 'string',
    response: 'string',
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
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    terminal: {
      status: 'Unpaired',
      terminalStatus: 'Idle',
      flow: 'Idle',
      txFlow: null,
      terminalConfig: {},
    },
  };
  expect(reducer(previousState, addTerminal(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
    },
  });
});

test('should handle when terminal is added', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    terminal: {
      status: null,
      terminalStatus: null,
      flow: null,
      txFlow: null,
      terminalConfig: {
        posId: 'Test',
        eftpos: '',
        autoAddress: true,
        serialNumber: '321-490-753',
        testMode: true,
        secureWebSocket: true,
        apiKey: 'BurgerPosDeviceAPIKey',
      },
    },
  };
  expect(reducer(previousState, addTerminal(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {
        posId: 'Test',
        eftpos: '',
        autoAddress: true,
        serialNumber: '321-490-753',
        testMode: true,
        secureWebSocket: true,
        apiKey: 'BurgerPosDeviceAPIKey',
      },
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateDeviceAddress', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    deviceAddress: '321-490-753.z1.sandbox.apdvcs.net',
  };

  expect(reducer(previousState, updateDeviceAddress(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {
        deviceAddress: '321-490-753.z1.sandbox.apdvcs.net',
      },
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateDeviceAddress for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    deviceAddress: '321-490-753.z1.sandbox.apdvcs.net',
  };

  expect(reducer(previousState, updateDeviceAddress(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      terminalConfig: {
        deviceAddress: '321-490-753.z1.sandbox.apdvcs.net',
      },
    },
  });
});

test('should handle updatePairingFlow', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Connected',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    pairingFlow: {
      message: 'Connecting...',
      awaitingCheckFromEftpos: false,
      awaitingCheckFromPos: false,
      confirmationCode: '',
      finished: false,
      successful: false,
    },
  };

  expect(reducer(previousState, updatePairingFlow(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        message: 'Connecting...',
        awaitingCheckFromEftpos: false,
        awaitingCheckFromPos: false,
        confirmationCode: '',
        finished: false,
        successful: false,
      },
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Connected',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updatePairingFlow when empty state & unpaired', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    pairingFlow: {
      message: 'Connecting...',
      awaitingCheckFromEftpos: false,
      awaitingCheckFromPos: false,
      confirmationCode: '',
      finished: true,
      successful: false,
    },
  };

  expect(reducer(previousState, updatePairingFlow(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      pairingFlow: {
        message: 'Connecting...',
        awaitingCheckFromEftpos: false,
        awaitingCheckFromPos: false,
        confirmationCode: '',
        finished: true,
        successful: false,
      },
      status: 'Unpaired',
    },
  });
});

test('should handle updatePairingStatus', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    status: 'PairedConnecting',
  };

  expect(reducer(previousState, updatePairingStatus(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'PairedConnecting',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updatePairingStatus for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    status: 'PairedConnecting',
  };

  expect(reducer(previousState, updatePairingStatus(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      status: 'PairedConnecting',
    },
  });
});

test('should handle removeTerminal', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
  };

  expect(reducer(previousState, removeTerminal(action))).toEqual({});
});

test('should handle updateTerminalSerialNumber', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    serialNumber: '321-490-753',
  };

  expect(reducer(previousState, updateTerminalSerialNumber(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {
        serialNumber: '321-490-753',
      },
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateTerminalSerialNumber for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    serialNumber: '321-490-753',
  };

  expect(reducer(previousState, updateTerminalSerialNumber(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      terminalConfig: {
        serialNumber: '321-490-753',
      },
    },
  });
});

test('should handle updateTerminalSecret', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    secret: {
      encKey: '123435u4758475848y8466666',
      hmacKey: '64736574hfrtu437777777',
    },
  };

  expect(reducer(previousState, updateTerminalSecret(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: {
        encKey: '123435u4758475848y8466666',
        hmacKey: '64736574hfrtu437777777',
      },
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateTerminalSecret for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    secret: {
      encKey: '123435u4758475848y8466666',
      hmacKey: '64736574hfrtu437777777',
    },
  };

  expect(reducer(previousState, updateTerminalSecret(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      secret: {
        encKey: '123435u4758475848y8466666',
        hmacKey: '64736574hfrtu437777777',
      },
    },
  });
});

test('should handle clearTransaction', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: dummyTxFlow(),
      secret: null,
      txMessage: {
        displayMessageCode: 0,
        displayMessageText: 'string ',
        posRefId: 'string',
        posCounter: 'string',
        decryptedJson: 'string',
      },
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
  };

  expect(reducer(previousState, clearTransaction(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle clearTransaction for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
  };

  expect(reducer(previousState, clearTransaction(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      txMessage: null,
      txFlow: null,
    },
  });
});

test('should handle updateTxFlow', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    txFlow: dummyTxFlow(),
  };

  expect(reducer(previousState, updateTxFlow(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: dummyTxFlow(),
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateTxFlow', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    txFlow: dummyTxFlow(),
  };

  expect(reducer(previousState, updateTxFlow(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: dummyTxFlow(),
      secret: null,
      txMessage: null,
      settings: null,
    },
  });
});

test('should handle updateTxFlow for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    txFlow: dummyTxFlow(),
  };

  expect(reducer(previousState, updateTxFlow(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      txFlow: dummyTxFlow(),
    },
  });
});

test('should handle updateSetting', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    settings: {
      eftposReceipt: true,
      sigFlow: true,
      printMerchantCopy: true,
      suppressMerchantPassword: true,
      receiptHeader: '',
      receiptFooter: '',
    },
  };

  expect(reducer(previousState, updateSetting(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: {
        eftposReceipt: true,
        sigFlow: true,
        printMerchantCopy: true,
        suppressMerchantPassword: true,
        receiptHeader: '',
        receiptFooter: '',
      },
    },
  });
});

test('should handle updateSetting for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    settings: {
      eftposReceipt: true,
      sigFlow: true,
      printMerchantCopy: true,
      suppressMerchantPassword: true,
      receiptHeader: '',
      receiptFooter: '',
    },
  };

  expect(reducer(previousState, updateSetting(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      settings: {
        eftposReceipt: true,
        sigFlow: true,
        printMerchantCopy: true,
        suppressMerchantPassword: true,
        receiptHeader: '',
        receiptFooter: '',
      },
    },
  });
});

test('should handle updateTxMessage', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: null,
      settings: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    txMessage: {
      displayMessageCode: 4,
      displayMessageText: 'Waiting for customer to enter tip',
      posRefId: 'purchase-2021-08-09T12:10:00.461Z',
      posCounter: '',
      decryptedJson:
        '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
    },
  };

  expect(reducer(previousState, updateTxMessage(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: dummyPairingFlow(),
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
      secret: null,
      txMessage: {
        displayMessageCode: 4,
        displayMessageText: 'Waiting for customer to enter tip',
        posRefId: 'purchase-2021-08-09T12:10:00.461Z',
        posCounter: '',
        decryptedJson:
          '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
      },
      settings: null,
    },
  });
});

test('should handle updateTxMessage for empty state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    txMessage: {
      displayMessageCode: 4,
      displayMessageText: 'Waiting for customer to enter tip',
      posRefId: 'purchase-2021-08-09T12:10:00.461Z',
      posCounter: '',
      decryptedJson:
        '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
    },
  };

  expect(reducer(previousState, updateTxMessage(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      txMessage: {
        displayMessageCode: 4,
        displayMessageText: 'Waiting for customer to enter tip',
        posRefId: 'purchase-2021-08-09T12:10:00.461Z',
        posCounter: '',
        decryptedJson:
          '{"message":{"data":{"display_me ssage_code":4,"display_message_text":"Waiting for customer to enter tip","pos_ref_id":"purchase-2021-08-09T12:10:00.461Z"},"datetime":"2021-08-09T22:09:59.871","event":"txn_update_message"}}',
      },
    },
  });
});
