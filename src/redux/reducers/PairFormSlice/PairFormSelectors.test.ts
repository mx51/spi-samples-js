import {
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
} from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { customMockPairFormParamsState, mockTerminalInstanceId } from '../../../utils/tests/common';
import { isPairDisabled } from './PairFormSelectors';

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
      pairForm: { ...mockPairFormParamsState, secrets: null },
      terminals: {},
      products: {
        tipAmount: 0,
        cashoutAmount: 0,
        surchargeAmount: 0,
        products: [],
      },
    };

    // Assert
    expect(isPairDisabled(mockState)).toBeFalsy();
  });

  test('test isPairDisabled() and return true as result', () => {
    // Arrange
    const mockState = {
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
      products: {
        tipAmount: 0,
        cashoutAmount: 0,
        surchargeAmount: 0,
        products: [],
      },
    };

    // Assert
    expect(isPairDisabled(mockState)).toBeTruthy();
  });
});
