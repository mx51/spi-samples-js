import reducer, {
  addTerminal,
  removeTerminal,
  updateDeviceAddress,
  updatePairingFlow,
  updatePairingStatus,
} from './terminalsSlice';

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
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
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
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
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
    },
  });
});

test('should handle updateDeviceAddress', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    eftpos: '321-490-753.z1.sandbox.apdvcs.net',
  };

  expect(reducer(previousState, updateDeviceAddress(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {
        eftpos: '321-490-753.z1.sandbox.apdvcs.net',
      },
      flow: null,
      terminalStatus: 'Idle',
      status: 'Unpaired',
      txFlow: null,
    },
  });
});

test('should handle updatePairingFlow', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
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
      status: 'Unpaired',
      txFlow: null,
    },
  });
});

test('should handle updatePairingStatus', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    status: 'PairedConnecting',
  };

  expect(reducer(previousState, updatePairingStatus(action))).toEqual({
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      flow: null,
      terminalStatus: 'Idle',
      status: 'PairedConnecting',
      txFlow: null,
    },
  });
});

test('should handle removeTerminal', () => {
  const previousState = {
    'c296b537-4fdd-4d18-92c1-68c330e935c9': {
      id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
      pairingFlow: {
        finished: true,
        message: null,
        awaitingCheckFromEftpos: null,
        awaitingCheckFromPos: null,
        confirmationCode: null,
        successful: null,
      },
      terminalConfig: {},
      terminalStatus: 'Idle',
      flow: null,
      status: 'Unpaired',
      txFlow: null,
    },
  };
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
  };

  expect(reducer(previousState, removeTerminal(action))).toEqual({});
});
