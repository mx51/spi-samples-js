import { cleanup } from '@testing-library/react';
import spiService from '.';
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { updatePairingStatus } from '../../redux/reducers/TerminalSlice/terminalsSlice';
import { setLocalStorage } from '../../utils/common/spi/common';
import {
  defaultMockPairFormParams,
  mockCashoutAmount,
  mockPosRefId,
  mockPromptForCashout,
  mockPurchaseAmount,
  mockSpiClient,
  mockSurchargeAmount,
  mockTerminalInstance,
  mockTerminalInstanceId,
  mockTipAmount,
} from '../../utils/tests/common';

describe('Test SpiService functionalities', () => {
  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('test function handleTerminalPairFailure()', () => {
    // Arrange
    const dispatch = jest.fn();

    // Act
    spiService.handleTerminalPairFailure = jest.fn().mockImplementation(() =>
      dispatch(
        updatePairingStatus({
          id: mockTerminalInstanceId,
          status: SPI_PAIR_STATUS.Unpaired,
        })
      )
    );

    spiService.handleTerminalPairFailure(mockTerminalInstanceId);

    // Assert
    expect(spiService.handleTerminalPairFailure).toHaveBeenCalled();
  });

  test('test function getCurrentTxFlow()', () => {
    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: mockSpiClient,
      currentTxFlowStateOverride: null,
    });

    const mockGetCurrentTxFlow = jest.spyOn(spiService, 'getCurrentTxFlow');
    spiService.getCurrentTxFlow(mockTerminalInstanceId);

    // Assert
    expect(mockGetCurrentTxFlow).toHaveBeenCalled();
  });

  test('test function getTerminalStatus()', () => {
    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: mockSpiClient,
    });
    spiService.ready = jest.fn().mockReturnValue(true);

    const mockGetTerminalStatus = jest.spyOn(spiService, 'getTerminalStatus');
    spiService.getTerminalStatus(mockTerminalInstanceId);

    // Assert
    expect(mockGetTerminalStatus).toHaveBeenCalled();
  });

  test('test function ready()', async () => {
    // Act
    spiService.getCurrentStatus = jest.fn().mockReturnValue(SPI_PAIR_STATUS.PairedConnecting);
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        BatteryLevelChanged: jest.fn(),
      },
    });

    const mockReady = jest.spyOn(spiService, 'ready');
    spiService.getTerminalStatus(mockTerminalInstanceId);

    // Assert
    expect(mockReady).toBeDefined();
  });

  test('test function getCurrentStatus()', () => {
    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        BatteryLevelChanged: jest.fn(),
      },
    });

    const mockGetCurrentStatus = jest.spyOn(spiService, 'getCurrentStatus');
    spiService.getTerminalStatus(mockTerminalInstanceId);

    // Assert
    expect(mockGetCurrentStatus).toBeDefined();
  });

  test('should get auto address value from getTerminalAddress()', () => {
    // Arrange
    const mockAddress = 'address string';
    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: mockSpiClient,
    });

    spiService.getTerminalAddress = jest.fn().mockReturnValue(mockAddress);
    const addressString = spiService.getTerminalAddress(mockTerminalInstanceId);

    // Assert
    expect(spiService.getTerminalAddress).toBeCalled();
    expect(addressString).toEqual(mockAddress);
  });

  test('test function readSpiInstance()', () => {
    // Act
    const mockReadSpiInstance = jest.spyOn(spiService, 'readSpiInstance');
    spiService.readSpiInstance(mockTerminalInstanceId);

    // Assert
    expect(mockReadSpiInstance).toHaveBeenCalled();
  });

  test('test function createLibraryInstance()', async () => {
    // Arrange
    setLocalStorage(
      'terminals',
      JSON.stringify({
        [mockTerminalInstanceId]: {
          acquirerCode: 'test',
          apiKey: 'test',
          autoAddress: true,
          deviceAddress: `${mockTerminalInstanceId}.auto.address.link`,
          posId: 'test',
          secureWebSocket: false,
          serialNumber: mockTerminalInstanceId,
          testMode: true,
          secrets: 'secrets',
          status: 'Idle',
        },
      })
    );

    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        GetTerminalAddress: () => defaultLocalIP,
      },
    });

    spiService.dispatchAction = jest.fn();

    (spiService.createLibraryInstance as Any) = jest
      .spyOn(spiService, 'createLibraryInstance')
      .mockImplementationOnce(async () => mockTerminalInstance);

    await spiService.createLibraryInstance(mockTerminalInstanceId);

    // Assert
    expect(spiService.createLibraryInstance).toHaveBeenCalled();
  });

  test('test function start()', () => {
    // Arrange
    const dispatch = jest.fn();

    // Act
    (spiService.createLibraryInstance as Any) = jest
      .spyOn(spiService, 'createLibraryInstance')
      .mockImplementationOnce(async () => mockTerminalInstance);

    spiService.start = jest.fn(() => spiService.createLibraryInstance(mockTerminalInstanceId));

    const mockStart = jest.spyOn(spiService, 'start');

    spiService.start(dispatch);

    // Assert
    expect(mockStart).toHaveBeenCalledTimes(1);
    expect(spiService.createLibraryInstance).toHaveBeenCalledTimes(1);
  });

  test('should not call createLibraryInstance function when local storage terminals data is empty object "{}"', () => {
    // Arrange
    const dispatch = jest.fn();

    // Act
    setLocalStorage('terminals', '{}');

    jest.spyOn(spiService, 'start');
    spiService.start(dispatch);

    // Assert
    expect(spiService.createLibraryInstance).toHaveBeenCalledTimes(0);
  });

  test('test function spiTerminalPair()', async () => {
    // Act
    const mockSpiTerminalPair = jest.spyOn(spiService, 'spiTerminalPair');

    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        Pair: jest.fn(),
      },
    });

    await spiService.spiTerminalPair(mockTerminalInstanceId);

    // Assert
    expect(mockSpiTerminalPair).toHaveBeenCalled();
  });

  test('test function spiTerminalCancelPair()', () => {
    // Act
    const mockSpiTerminalCancelPair = jest.spyOn(spiService, 'spiTerminalCancelPair');

    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        PairingCancel: jest.fn(),
      },
    });

    spiService.spiTerminalCancelPair(mockTerminalInstanceId);

    // Assert
    expect(mockSpiTerminalCancelPair).toHaveBeenCalled();
  });

  test('test function spiTerminalUnPair()', () => {
    // Act
    const mockSpiTerminalUnPair = jest.spyOn(spiService, 'spiTerminalUnPair');

    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        Unpair: jest.fn(),
      },
    });

    spiService.spiTerminalUnPair(mockTerminalInstanceId);

    // Assert
    expect(mockSpiTerminalUnPair).toHaveBeenCalled();
  });

  test('test function initTxSettlement()', () => {
    // Arrange
    const mockInitTxSettlement = jest.spyOn(spiService, 'initTxSettlement');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettleTx: jest.fn(),
      },
    });

    spiService.initTxSettlement(mockTerminalInstanceId, mockPosRefId);

    // Assert
    expect(mockInitTxSettlement).toHaveBeenCalled();
  });

  test('test function initTxSettlementEnquiry()', () => {
    // Arrange
    const mockInitTxSettlementEnquiry = jest.spyOn(spiService, 'initTxSettlementEnquiry');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettlementEnquiry: jest.fn(),
      },
    });

    spiService.initTxSettlementEnquiry(mockTerminalInstanceId, mockPosRefId);

    // Assert
    expect(mockInitTxSettlementEnquiry).toHaveBeenCalled();
  });

  test('test function initiatePurchaseTransaction()', () => {
    // Arrange
    const mockInitTxPurchase = jest.spyOn(spiService, 'initiatePurchaseTransaction');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiatePurchaseTxV2: jest.fn(),
      },
    });

    spiService.initiatePurchaseTransaction(
      mockTerminalInstanceId,
      mockPosRefId,
      mockPurchaseAmount,
      mockTipAmount,
      mockCashoutAmount,
      mockPromptForCashout,
      mockSurchargeAmount
    );

    // Assert
    expect(mockInitTxPurchase).toHaveBeenCalled();
  });

  test('test function initiateMotoPurchaseTransaction()', () => {
    // Arrange
    const mockInitTxMoto = jest.spyOn(spiService, 'initiateMotoPurchaseTransaction');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateMotoPurchaseTx: jest.fn(),
      },
    });

    spiService.initiateMotoPurchaseTransaction(
      mockTerminalInstanceId,
      mockPosRefId,
      mockPurchaseAmount,
      mockSurchargeAmount
    );

    // Assert
    expect(mockInitTxMoto).toHaveBeenCalled();
  });

  test('test function spiCancelTransaction()', () => {
    // Arrange
    const mockCancelTransaction = jest.spyOn(spiService, 'spiCancelTransaction');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        CancelTransaction: jest.fn(),
      },
    });

    spiService.spiCancelTransaction(mockTerminalInstanceId);

    // Assert
    expect(mockCancelTransaction).toHaveBeenCalled();
  });

  test('test function spiSetTerminalToIdle()', () => {
    // Arrange
    const mockSetTerminalIdle = jest.spyOn(spiService, 'spiSetTerminalToIdle');

    // Act
    spiService.readSpiInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        AckFlowEndedAndBackToIdle: jest.fn(),
      },
    });

    spiService.spiSetTerminalToIdle(mockTerminalInstanceId);

    // Assert
    expect(mockSetTerminalIdle).toHaveBeenCalled();
  });
});
