import { cleanup } from '@testing-library/react';
import { TEXT_FORM_DEFAULT_VALUE } from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import spiService from '../../../services/spiService';
import { defaultMockPairFormParams, mockTerminalInstance, mockTerminalInstanceId } from '../../tests/common';
import { handleCancelPairClick, handlePairClick, handleUnPairClick } from './pairStatusHelpers';

const mockPairSettings = {
  provider: { isValid: true, option: TEXT_FORM_DEFAULT_VALUE, value: 'test' },
  configuration: { isValid: true, type: 'eftpos', value: defaultLocalIP },
  serialNumber: { isValid: true, value: '123-123-123' },
  posId: { isValid: true, value: 'test' },
  apikey: { isValid: true, value: 'test' },
  testMode: true,
};

describe('Test pairStatusHelpers functions', () => {
  const dispatch = jest.fn();
  const mockInstanceId = mockPairSettings.serialNumber.value;

  afterEach(cleanup);

  test('test handlePairClick()', () => {
    // Arrange
    const mockPairForm = {
      acquirerCode: defaultMockPairFormParams.acquirerCode.value,
      autoAddress: false,
      deviceAddress: defaultMockPairFormParams.deviceAddress.value,
      posId: defaultMockPairFormParams.posId.value,
      serialNumber: defaultMockPairFormParams.serialNumber.value,
      testMode: defaultMockPairFormParams.testMode,
      secrets: null,
    };
    // Act
    handlePairClick(dispatch, mockPairForm);

    spiService.dispatchAction = jest.fn();
    spiService.createLibraryInstance = jest.fn().mockImplementationOnce(() => mockTerminalInstance);
    spiService.createLibraryInstance(mockInstanceId);

    // Assert
    expect(spiService.createLibraryInstance).toHaveBeenCalledTimes(1);
  });

  test('test handleCancelPairClick()', () => {
    // Act
    handleCancelPairClick(dispatch, mockTerminalInstanceId);

    spiService.spiTerminalCancelPair = jest.fn();
    spiService.spiTerminalCancelPair(mockInstanceId);

    // Assert
    expect(spiService.spiTerminalCancelPair).toHaveBeenCalledTimes(1);
  });

  test('test handleUnPairClick()', () => {
    // Act
    handleUnPairClick(dispatch, mockTerminalInstanceId);

    spiService.spiTerminalUnPair = jest.fn();
    spiService.spiTerminalUnPair(mockInstanceId);

    // Assert
    expect(spiService.spiTerminalUnPair).toHaveBeenCalledTimes(1);
  });
});
