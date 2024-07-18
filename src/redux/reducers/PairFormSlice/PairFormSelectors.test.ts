import { isPairDisabled } from './PairFormSelectors';
import {
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
} from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import {
  customMockPairFormParamsState,
  defaultMockCommonState,
  mockTerminalInstanceId,
  defaultMockPayAtTableState,
} from '../../../utils/tests/common';

describe('Test PairFormSelectors', () => {
  test('test isPairDisabled() and return false as result', () => {
    // Arrange
    const mockPairFormParamsState = customMockPairFormParamsState(
      {
        value: 'test',
        option: TEXT_FORM_DEFAULT_VALUE,
        isValid: true,
      },
      TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
      {
        value: defaultLocalIP,
        isValid: true,
      },
      {
        value: 'test',
        isValid: true,
      },
      {
        value: mockTerminalInstanceId,
        isValid: true,
      },
      true
    );

    const mockState = {
      common: defaultMockCommonState,
      pairForm: { ...mockPairFormParamsState, secrets: null },
      terminals: {},
      pairings: {},
      products: {
        keypadAmount: 0,
        tipAmount: 0,
        cashoutAmount: 0,
        surchargeAmount: 0,
        promptForCashout: false,
        products: [],
        subtotalAmount: 0,
        overrideSubtotalAmount: false,
      },
      selectedTerminal: { selectedTerminalId: '' },
      preAuth: {
        openPreAuths: [],
        keyPadAmount: 0,
        _persist: {
          version: -1,
          rehydrated: true,
        },
      },
      payAtTable: defaultMockPayAtTableState,
    };

    // Assert
    expect(isPairDisabled(mockState)).toBeFalsy();
  });

  test('test isPairDisabled() and return true as result', () => {
    // Arrange
    const mockState = {
      common: defaultMockCommonState,
      pairForm: {
        ...customMockPairFormParamsState(
          {
            value: '',
            option: TEXT_FORM_DEFAULT_VALUE,
            isValid: false,
          },
          TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE
        ),
        secrets: null,
      },
      terminals: {},
      pairings: {},
      products: {
        keypadAmount: 0,
        tipAmount: 0,
        cashoutAmount: 0,
        surchargeAmount: 0,
        promptForCashout: false,
        products: [],
        subtotalAmount: 0,
        overrideSubtotalAmount: false,
      },
      selectedTerminal: { selectedTerminalId: '' },
      preAuth: {
        openPreAuths: [],
        keyPadAmount: 0,
        _persist: {
          version: -1,
          rehydrated: true,
        },
      },
      payAtTable: defaultMockPayAtTableState,
    };

    // Assert
    expect(isPairDisabled(mockState)).toBeTruthy();
  });
});
