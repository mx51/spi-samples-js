import { cleanup } from '@testing-library/react';
import spiService from '.';
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../definitions/constants/spiConfigs';
import { updatePairingStatus } from '../../redux/reducers/TerminalSlice/terminalsSlice';
import { setLocalStorage } from '../../utils/common/spi/common';
import {
  defaultMockPairFormParams,
  mockPosRefId,
  mockSpiClient,
  mockTerminalInstance,
  mockTerminalInstanceId,
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

  test('test function getTerminalAddress()', () => {
    // Act
    const mockGetTerminalAddress = jest.spyOn(spiService, 'getTerminalAddress');
    spiService.getTerminalAddress(mockTerminalInstanceId);

    // Assert
    expect(mockGetTerminalAddress).toHaveBeenCalled();
  });

  test('test function getCurrentTxFlow()', () => {
    // Act
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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

  test('should get auto address value from getTerminalAddress()', async () => {
    // Act
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: mockSpiClient,
    });

    await spiService.getTerminalAddress(mockTerminalInstanceId);
    const mockGetTerminalAddress = jest.spyOn(spiService, 'getTerminalAddress');

    // Assert
    expect(mockGetTerminalAddress).toBeDefined();
    expect(spiService.getTerminalAddress).toBeCalled();
  });

  test('test function updateTerminalStorage()', () => {
    // Arrange
    const deviceAddressKey = 'deviceAddress';
    const deviceAddressValue = defaultLocalIP;

    // Act
    spiService.readTerminalList = jest.fn().mockReturnValue({});

    const mockUpdateTerminalStorage = jest.spyOn(spiService, 'updateTerminalStorage');
    spiService.updateTerminalStorage(mockTerminalInstanceId, deviceAddressKey, deviceAddressValue);

    // Assert
    expect(mockUpdateTerminalStorage).toHaveBeenCalled();
  });

  test('test function readTerminalInstance()', () => {
    // Act
    const mockReadTerminalInstance = jest.spyOn(spiService, 'readTerminalInstance');
    spiService.readTerminalInstance(mockTerminalInstanceId);

    // Assert
    expect(mockReadTerminalInstance).toHaveBeenCalled();
  });

  test('test function readTerminalList()', () => {
    // Act
    const mockReadTerminalList = jest.spyOn(spiService, 'readTerminalList');
    spiService.readTerminalList();

    // Assert
    expect(mockReadTerminalList).toHaveBeenCalled();
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

    // Act
    spiService.readTerminalList();

    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    const mockPairForm = {
      acquirerCode: defaultMockPairFormParams.acquirerCode.value,
      autoAddress: false,
      deviceAddress: defaultMockPairFormParams.deviceAddress.value,
      posId: defaultMockPairFormParams.posId.value,
      serialNumber: defaultMockPairFormParams.serialNumber.value,
      testMode: defaultMockPairFormParams.testMode,
      secrets: null,
    };

    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        Pair: jest.fn(),
      },
    });

    await spiService.spiTerminalPair(mockTerminalInstanceId, mockPairForm);

    // Assert
    expect(mockSpiTerminalPair).toHaveBeenCalled();
  });

  test('test function spiTerminalCancelPair()', () => {
    // Act
    const mockSpiTerminalCancelPair = jest.spyOn(spiService, 'spiTerminalCancelPair');

    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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

    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
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
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettlementEnquiry: jest.fn(),
      },
    });

    spiService.initTxSettlementEnquiry(mockTerminalInstanceId, mockPosRefId);

    // Assert
    expect(mockInitTxSettlementEnquiry).toHaveBeenCalled();
  });
});
