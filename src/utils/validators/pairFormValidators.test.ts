import { defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { pairedMockTerminals } from '../tests/common';
import {
  eftposAddressValidator,
  eftposIPAddressValidator,
  postIdValidator,
  serialNumberValidatorOnBlur,
  serialNumberValidatorOnChange,
} from './pairFormValidators';

describe('Test pairFormValidators functions', () => {
  test('should return true when eftpos address is valid (positive case)', () => {
    // Arrange
    const validEftposAddress = eftposAddressValidator('auto', defaultLocalIP);

    // Assert
    expect(validEftposAddress).toBe(true);
  });

  test('should return false when eftpos address is invalid (negative case)', () => {
    // Arrange
    const invalidEftposAddress = eftposAddressValidator('eftpos', 'defaultLocalIP');

    // Assert
    expect(invalidEftposAddress).toBe(false);
  });

  test('should return true when eftpos IP address is valid (positive case)', () => {
    // Arrange
    const validEftposIPAddress = eftposIPAddressValidator(defaultLocalIP);

    // Assert
    expect(validEftposIPAddress).toBe(true);
  });

  test('should return false when eftpos IP address is invalid (negative case)', () => {
    // Arrange
    const invalidEftposIPAddress = eftposIPAddressValidator('defaultLocalIP');

    // Assert
    expect(invalidEftposIPAddress).toBe(false);
  });

  test('should not accept number typed value for serial number after user finish typing', () => {
    // Arrange
    const errorMessage = 'Sorry, the serial number should only contain numbers. Please try again.';
    const characterSerialNumber = serialNumberValidatorOnBlur('testTests');

    // Assert
    expect(characterSerialNumber).toEqual(errorMessage);
  });

  test('should not accept number typed value for serial number during typing', () => {
    // Arrange
    const errorMessage = 'Sorry, the serial number should only contain numbers. Please try again.';
    const characterSerialNumber = serialNumberValidatorOnChange('testTests');

    // Assert
    expect(characterSerialNumber).toEqual(errorMessage);
  });

  test('should not accept same pos id during user typing', () => {
    // Arrange
    const errorMessage = 'POS Id must be unique, please choose another';
    const duplicatedPosId = postIdValidator('test', pairedMockTerminals);

    // Assert
    expect(duplicatedPosId).toEqual(errorMessage);
  });

  test('should only accept alphanumeric characters for pos id', () => {
    // Arrange
    const errorMessage = 'POS Id must contain only alphanumeric characters';
    const specialCharactersPosId = postIdValidator('@#test!!', pairedMockTerminals);

    // Assert
    expect(specialCharactersPosId).toEqual(errorMessage);
  });

  test('should not accept pos id beyond 16 characters', () => {
    // Arrange
    const errorMessage = 'POS Id must be less than 16 characters long';
    const overLengthPosId = postIdValidator('testTestTestTestTestTest', pairedMockTerminals);

    // Assert
    expect(overLengthPosId).toEqual(errorMessage);
  });
});
