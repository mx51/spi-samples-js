import { cleanup } from '@testing-library/react';
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
} from '../../../definitions/constants/commonConfigs';
import { defaultAAR, defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { isHttps } from '../../../utils/common/pair/pairFormHelpers';
import {
  customMockPairFormParamsState,
  defaultMockPairFormParams,
  mockTerminalInstanceId,
} from '../../../utils/tests/common';
import reducer, { updatePairFormParams } from './pairFormSlice';

const mockSerialNumber = '222-222-222';
const mockAar = defaultAAR;

describe('Test pairFormSlice', () => {
  afterEach(cleanup);

  test('Test updatePairFormParams() form params state value update', () => {
    // Arrange
    const mockFormParams = [
      { key: 'acquirerCode', value: { value: 'test', isValid: true } },
      { key: 'addressType', value: 'auto' },
      { key: 'deviceAddress', value: { value: mockAar, isValid: true } },
      { key: 'posId', value: { value: 'test', isValid: true } },
      { key: 'serialNumber', value: { value: mockSerialNumber, isValid: true } },
      { key: 'testMode', value: true },
    ];

    // Act
    for (let index = 0; index < mockFormParams.length; index += 1) {
      const expectedResult = {
        ...defaultMockPairFormParams,
        [mockFormParams[index].key]: mockFormParams[index].value,
      };

      // Assert
      expect(
        reducer(
          defaultMockPairFormParams,
          updatePairFormParams({
            key: mockFormParams[index].key,
            value: mockFormParams[index].value,
          })
        )
      ).toMatchObject(expectedResult);
    }
  });

  test('show initialState if no key matches', () => {
    const initialState = customMockPairFormParamsState(
      {
        value: 'test',
        isValid: true,
      },
      TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
      {
        value: defaultLocalIP,
        isValid: true,
      },
      {
        value: 'test',
        isValid: true,
      },
      {
        value: mockTerminalInstanceId,
        isValid: true,
      },
      true
    );

    // Assert
    expect(
      reducer(
        defaultMockPairFormParams,
        updatePairFormParams({
          key: 'unknown',
          value: null,
        })
      )
    ).toMatchObject(initialState);
  });

  test('should display auto address type when url starts with https://', () => {
    // Arrange
    const mockResponse = jest.fn();

    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        protocol: 'https:',
        assign: mockResponse,
      },
      writable: true,
    });

    // Act
    const mockInitialState = {
      acquirerCode: '',
      addressType: isHttps()
        ? TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE
        : TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
      deviceAddress: defaultLocalIP,
      posId: '',
      serialNumber: '',
      testMode: false,
      aar: '',
    };

    // Assert
    expect(mockInitialState.addressType).toBe(TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE);
  });
});
