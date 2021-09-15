// import { Spi as SpiClient } from '@mx51/spi-client-js';
import { cleanup } from '@testing-library/react';

describe('Test SpiService functionalities', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Test createOrUpdateTerminal()', () => {});
});
