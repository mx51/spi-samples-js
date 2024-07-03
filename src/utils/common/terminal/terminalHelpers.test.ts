import { cleanup } from '@testing-library/react';
import spiService from '../../../services/spiService';
import { mockPosRefId, mockSpiClient, mockTerminalInstanceId } from '../../tests/common';
import { approveSignature, declineSignature, settlement, settlementEnquiry } from './terminalHelpers';

describe('Test terminalHelpers()', () => {
  afterEach(cleanup);

  test('should settlement() be defined when calling initTxSettlement() function', () => {
    // Arrange
    spiService.readSpiInstance = jest.fn().mockReturnValue({
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
    spiService.readSpiInstance = jest.fn().mockReturnValue({
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

  test('should approveSignature() be defined when calling signatureForApprove() function', () => {
    // Arrange
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        AcceptSignature: jest.fn(),
      },
    });
    spiService.signatureForApprove = jest.fn();

    // Act
    approveSignature(mockTerminalInstanceId);

    // Assert
    expect(spiService.signatureForApprove).toBeDefined();
    expect(spiService.signatureForApprove).toBeCalledTimes(1);
  });

  test('should declineSignature() be defined when calling signatureForDecline() function', () => {
    // Arrange
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        AcceptSignature: jest.fn(),
      },
    });
    spiService.signatureForDecline = jest.fn();

    // Act
    declineSignature(mockTerminalInstanceId);

    // Assert
    expect(spiService.signatureForDecline).toBeDefined();
    expect(spiService.signatureForDecline).toBeCalledTimes(1);
  });
});
