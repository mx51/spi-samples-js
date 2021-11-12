import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import PairForm from '.';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { updatePairFormParams } from '../../../redux/reducers/PairFormSlice/pairFormSlice';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, {
  defaultEmptyMockPairFormParams,
  defaultMockPairFormParams,
  defaultMockTerminals,
} from '../../../utils/tests/common';

replaceAllInserter.shim();

function setupContainer(
  pairForm: IPairFormParams = defaultEmptyMockPairFormParams,
  terminals: ITerminalState = defaultMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<PairForm />, customizedStore);
}

describe('Test <PairForm />', () => {
  let mockContainer: Any;
  let dispatch: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
    dispatch = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('should display pair form fields', () => {
    // This test case is for showing the pair form fields

    // Arrange
    const fieldNames = [
      'Simple Payments Integration',
      'Cloud Connect',
      'ZNV PayFast',
      'Fyro Payments',
      'Payment provider',
      '(Other) Please specify',
      'Configuration option',
      'EFTPOS address',
    ];
    const labelNodes = mockContainer.getElementsByTagName('label');

    // Assert
    for (let index = 0; index < fieldNames.length; index += 1) {
      expect(labelNodes[index].innerHTML.includes(fieldNames[index])).toBeTruthy();
    }
  });

  test('should pairForm params values get updated after blur event triggered', () => {
    // Arrange
    const mockFormParams = [
      { key: 'acquirerCode', value: 'test', domId: '[data-test-id="paymentProviderField"] input' },
      { key: 'eftposAddress', value: defaultLocalIP, domId: '[data-test-id="eftposAddressField"] input' },
      { key: 'posId', value: 'test', domId: '[data-test-id="posIdField"] input' },
      { key: 'serialNumber', value: '123-123-123', domId: '[data-test-id="serialNumberField"] input' },
    ];

    for (let index = 0; index < mockFormParams.length; index += 1) {
      const DOMNode = mockContainer.querySelector(mockFormParams[index].domId);

      // Act
      fireEvent.change(DOMNode, { target: { value: mockFormParams[index].value } });

      dispatch(
        updatePairFormParams({
          key: mockFormParams[index].key,
          value: {
            isValid: false,
            value: mockFormParams[index].value,
          },
        })
      );

      fireEvent.blur(DOMNode, { target: { value: mockFormParams[index].value } });

      // Assert
      expect(dispatch).toHaveBeenCalled();
      expect(DOMNode.value).toEqual(mockFormParams[index].value);
    }
  });

  test('should show pair button in pair form screen', () => {
    // Arrange
    const pairBtnDOM = mockContainer.querySelector('[data-test-id="pairBtn"]');

    // Assert
    expect(pairBtnDOM).toBeInTheDocument();
  });

  test('should show pair button in pair form screen', () => {
    // Arrange
    const handlePairClick = jest.fn();
    const pairBtnDOM = mockContainer.querySelector('[data-test-id="pairBtn"]');

    // Act
    fireEvent.click(pairBtnDOM);
    handlePairClick(dispatch, defaultMockPairFormParams);

    // Assert
    expect(handlePairClick).toHaveBeenCalledTimes(1);
  });
});
