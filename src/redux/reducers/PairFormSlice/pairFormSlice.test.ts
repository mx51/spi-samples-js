import { cleanup } from '@testing-library/react';
import {
  TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
} from '../../../definitions/constants/commonConfigs';
import { defaultAAR, defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import {
  customMockPairFormParamsState,
  defaultMockPairFormParams,
  mockTerminalInstanceId,
} from '../../../utils/tests/common';
import reducer, { readTerminalPairError, updatePairFormParams } from './pairFormSlice';

const mockSerialNumber = '222-222-222';
const mockAar = defaultAAR;

describe('Test pairFormSlice', () => {
  afterEach(cleanup);

  test('should form params state value updated when calling updatePairFormParams()', () => {
    // Arrange
    const mockFormParams = [
      { key: 'acquirerCode', value: { value: 'test', option: TEXT_FORM_DEFAULT_VALUE, isValid: true } },
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
        option: TEXT_FORM_DEFAULT_VALUE,
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
      addressType: TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE,
      deviceAddress: defaultLocalIP,
      posId: '',
      serialNumber: '',
      testMode: false,
      aar: '',
    };

    // Assert
    expect(mockInitialState.addressType).toBe(TEXT_FORM_CONFIGURATION_AUTO_ADDRESS_VALUE);
  });

  test('should return error state when calling readTerminalPairError()', () => {
    // Arrange
    const mockErrorState = {
      isShown: true,
      message:
        'Sorry, we were unable to pair with the EFTPOS terminal. Please check the Serial Number and Payment Provider have been entered correctly and try again',
    };
    const currentMockPairFormState = {
      ...defaultMockPairFormParams,
      error: mockErrorState,
    };

    // Assert
    expect(reducer(defaultMockPairFormParams, readTerminalPairError(mockErrorState))).toMatchObject(
      currentMockPairFormState
    );
  });
});
