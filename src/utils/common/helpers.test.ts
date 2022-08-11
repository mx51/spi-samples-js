import { cleanup } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import { serialNumberFormatter } from './helpers';

replaceAllInserter.shim();

describe('Test helpers()', () => {
  afterEach(cleanup);

  test('should return serial number with dash when running serialNumberFormatter()', () => {
    // Arrange
    const inputSerialNumber = '123456789';

    // Act
    const result = serialNumberFormatter(inputSerialNumber);

    // Assert
    expect(result).toBe('123-456-789');
  });
});
