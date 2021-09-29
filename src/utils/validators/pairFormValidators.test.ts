import { defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { eftposAddressValidator, eftposIPAddressValidator } from './pairFormValidators';

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
});
