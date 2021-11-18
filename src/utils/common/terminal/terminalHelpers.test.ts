import { cleanup } from '@testing-library/react';
import spiService from '../../../services/spiService';
import { mockPosRefId, mockSpiClient, mockTerminalInstanceId } from '../../tests/common';
import { settlement, settlementEnquiry } from './terminalHelpers';

describe('Test terminalHelpers()', () => {
  afterEach(cleanup);

  test('should settlement() be defined when calling initTxSettlement() function', () => {
    // Arrange
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettleTx: jest.fn(),
      },
    });
    spiService.initTxSettlement = jest.fn();

    // Act
    settlement(mockTerminalInstanceId, mockPosRefId);

    // Assert
    expect(spiService.initTxSettlement).toBeDefined();
    expect(spiService.initTxSettlement).toBeCalledTimes(1);
  });

  test('should settlementEnquiry() be defined when calling initTxSettlementEnquiry() function', () => {
    // Arrange
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettlementEnquiry: jest.fn(),
      },
    });
    spiService.initTxSettlementEnquiry = jest.fn();

    // Act
    settlementEnquiry(mockTerminalInstanceId, mockPosRefId);

    // Assert
    expect(spiService.initTxSettlementEnquiry).toBeDefined();
    expect(spiService.initTxSettlementEnquiry).toBeCalledTimes(1);
  });
});
