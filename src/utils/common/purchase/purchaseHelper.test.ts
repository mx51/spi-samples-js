import { cleanup } from '@testing-library/react';
import spiService from '../../../services/spiService';
import {
  mockCashoutAmount,
  mockPosRefId,
  mockPromptForCashout,
  mockPurchaseAmount,
  mockSpiClient,
  mockSurchargeAmount,
  mockTipAmount,
} from '../../tests/common';
import { initiateMotoPurchase, initiatePurchase, setTerminalToIdle } from './purchaseHelper';

describe('Test purchaseHelper()', () => {
  afterEach(cleanup);

  test('should initiatePurchase() be defined when calling initiatePurchaseTransaction() function', () => {
    // Arrange
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        initiatePurchase: jest.fn(),
      },
    });
    spiService.initiatePurchaseTransaction = jest.fn();

    // Act
    initiatePurchase(
      mockPosRefId,
      mockPurchaseAmount,
      mockTipAmount,
      mockCashoutAmount,
      mockSurchargeAmount,
      mockPromptForCashout
    );

    // Assert
    expect(spiService.initiatePurchaseTransaction).toBeDefined();
    expect(spiService.initiatePurchaseTransaction).toBeCalledTimes(1);
  });

  test('should initiateMotoPurchase() be defined when calling initiateMotoPurchaseTransaction() function', () => {
    // Arrange
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        initiateMotoPurchaseTransaction: jest.fn(),
      },
    });
    spiService.initiateMotoPurchaseTransaction = jest.fn();

    // Act
    initiateMotoPurchase(mockPosRefId, mockPurchaseAmount, mockSurchargeAmount);

    // Assert
    expect(spiService.initiateMotoPurchaseTransaction).toBeDefined();
    expect(spiService.initiateMotoPurchaseTransaction).toBeCalledTimes(1);
  });

  test('should setTerminalToIdle() be defined when calling spiSetTerminalToIdle() function', () => {
    // Arrange
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        spiSetTerminalToIdle: jest.fn(),
      },
    });
    spiService.spiSetTerminalToIdle = jest.fn();

    // Act
    setTerminalToIdle(mockPosRefId);

    // Assert
    expect(spiService.spiSetTerminalToIdle).toBeDefined();
    expect(spiService.spiSetTerminalToIdle).toBeCalledTimes(1);
  });
});
