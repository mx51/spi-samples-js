import { cleanup } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import { isHttps, serialNumberFormatter } from './pairFormHelpers';

replaceAllInserter.shim();

describe('Test pairFormHelpers()', () => {
  afterEach(cleanup);

  test('should return false when running isHttps()', () => {
    // Act
    const result = isHttps();

    // Assert
    expect(result).toBeFalsy();
  });

  test('should return serial number with dash when running serialNumberFormatter()', () => {
    // Arrange
    const inputSerialNumber = '123456789';

    // Act
    const result = serialNumberFormatter(inputSerialNumber);

    // Assert
    expect(result).toBe('123-456-789');
  });
});
