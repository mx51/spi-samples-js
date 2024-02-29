import { cleanup } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import { isHttps } from './pairFormHelpers';

replaceAllInserter.shim();

describe('Test pairFormHelpers()', () => {
  afterEach(cleanup);

  test('should return false when running isHttps()', () => {
    // Act
    const result = isHttps();

    // Assert
    expect(result).toBeFalsy();
  });
});
