import { TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE } from '../../definitions/constants/commonConfigs';
import { customMockPairFormParamsState, mockTerminalInstanceId } from './common';

describe('Test common functions for unit tests', () => {
  test('should return correct value when calling customMockPairFormParamsState()', () => {
    // Arrange
    const acquireCode = {
      isValid: true,
      option: 'wbc',
      value: 'wbc',
    };
    const addressType = TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE;
    const deviceAddress = {
      value: 'auto-address',
      isValid: true,
    };
    const posId = {
      value: 'Mock POS',
      isValid: true,
    };
    const serialNumber = {
      value: mockTerminalInstanceId,
      isValid: true,
    };
    const testMode = false;

    const expectResult = {
      acquirerCode: { isValid: true, option: 'wbc', value: 'wbc' },
      addressType: 'auto',
      deviceAddress: { value: 'auto-address', isValid: true },
      posId: { value: 'Mock POS', isValid: true },
      serialNumber: { value: '123-123-123', isValid: true },
      testMode: false,
    };

    // Assert
    expect(
      customMockPairFormParamsState(acquireCode, addressType, deviceAddress, posId, serialNumber, testMode)
    ).toMatchObject(expectResult);
  });

  test('should return default value if value was not given by default when calling customMockPairFormParamsState()', () => {
    // Arrange
    const expectResult = {
      acquirerCode: { value: '', option: '(Other) Please specify', isValid: true },
      addressType: 'eftpos',
      deviceAddress: { value: '', isValid: true },
      posId: { value: '', isValid: true },
      serialNumber: { value: '', isValid: true },
      testMode: true,
    };

    // Assert
    expect(customMockPairFormParamsState()).toMatchObject(expectResult);
  });
});
