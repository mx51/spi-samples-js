/* eslint-disable no-underscore-dangle */
import { Spi as SpiClient } from '@mx51/spi-client-js';
import { cleanup } from '@testing-library/react';
import { IPairFormSettings } from '../../components/PairPage/PairForm/interfaces';
import SpiEventTarget from '../../utils/common/spi/eventTarget';
import SpiService from '../spiService';

const mockPairFormSettings: IPairFormSettings = {
  posId: 'Test2',
  eftpos: '222',
  autoAddress: true,
  serialNumber: '222-222-222',
  testMode: true,
  secureWebSocket: true,
  apiKey: 'TestAPIKey2',
};

const mockInstanceId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000';

const expectedInstanceConfigs = {
  ...mockPairFormSettings,
  secrets: null,
  print_merchant_copy_input: false,
  receipt_from_eftpos: false,
  check_sig_eftpos: false,
  use_secure_web_sockets: false,
  options: null,
  spi_receipt_header: '',
  spi_receipt_footer: '',
};

const MockedSpiEventTarget = <jest.Mock<SpiEventTarget>>SpiEventTarget;

describe('Test SpiService functionalities', () => {
  let spiService: Any;

  beforeEach(() => {
    jest.resetModules();

    spiService = new SpiService();
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Test initializeTerminalInstance()', () => {
    // Act
    const result = spiService.initializeTerminalInstance(mockInstanceId, mockPairFormSettings);
    // Assert
    expect(result).toMatchObject(expectedInstanceConfigs);
  });

  test('Test createOrUpdateTerminal()', () => {
    // Arrange
    const { posId, serialNumber, eftpos } = mockPairFormSettings;
    const secrets = null;
    // Act
    const MockSpiEventTarget = new MockedSpiEventTarget();
    MockSpiEventTarget.addEventListener = jest.fn(() => () => {});
    spiService.terminalInstance[mockInstanceId] = MockSpiEventTarget;
    spiService.terminalInstance[mockInstanceId].spiClient = new SpiClient(posId, serialNumber, eftpos, secrets);
    const terminal = spiService.createOrUpdateTerminal(mockInstanceId, mockPairFormSettings);
    // Assert
    expect(MockSpiEventTarget.dispatchEvent({ event: { type: 'TestEvent' } })).toBeTruthy();
    expect(terminal.spiClient._posId).toEqual('Test2');
    expect(terminal.spiClient.CurrentFlow).toEqual('Idle');
    expect(terminal.spiClient.CurrentTxFlowState).toBeNull();
    expect(terminal.spiClient.Config.PrintMerchantCopy).toBeFalsy();
  });
});
