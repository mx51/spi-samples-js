import reducer, { addTerminal } from './terminalsSlice';

test('should handle a initial add terminal state', () => {
  const previousState = {};
  const action = {
    id: 'c296b537-4fdd-4d18-92c1-68c330e935c9',
    payload: {
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
        Finished: true,
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
        Finished: true,
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
    payload: {
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
        Finished: true,
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
