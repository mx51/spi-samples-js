import React from 'react';
import { cleanup, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import PairForm from '.';
import { TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE } from '../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../definitions/constants/spiConfigs';
import { IPairFormParams } from '../../../redux/reducers/PairFormSlice/interfaces';
import { updatePairFormParams } from '../../../redux/reducers/PairFormSlice/pairFormSlice';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, {
  defaultMockPairFormParams,
  defaultMockTerminals,
  mockTerminalInstanceId,
} from '../../../utils/tests/common';

replaceAllInserter.shim();

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
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
  let setFormState: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
    dispatch = jest.fn();
    setFormState = jest.fn();
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

  test('should change the form field value after user started typing', () => {
    // This test case is for posId field onChange event testing

    // Arrange
    const posIdValue = 'Mock POS';
    const posIdFieldDOM = mockContainer.querySelector('[data-test-id="posIdField"] input');

    // Act
    fireEvent.change(posIdFieldDOM, { target: { value: posIdValue } });

    // Assert
    expect(posIdFieldDOM.value).toEqual(posIdValue);
  });

  test('should display serial number after changes made', () => {
    // This test case is for serial number onChange event

    // Arrange
    const serialNumber = mockTerminalInstanceId;
    const serialNumberFieldDOM = mockContainer.querySelector('[data-test-id="serialNumberField"] input');

    // Act
    fireEvent.change(serialNumberFieldDOM, { target: { value: serialNumber } });

    // Assert
    expect(serialNumberFieldDOM.value).toEqual(serialNumber);
  });

  test('should show the error adornment icon when field input is invalid', () => {
    // This test case is for form field error handling

    // Arrange
    const invalidSerialNumber = '';
    const adornmentErrorClassName = 'MuiSvgIcon-colorError';
    const serialNumberFieldDOM = mockContainer.querySelector('[data-test-id="serialNumberField"] input');

    // Act
    fireEvent.change(serialNumberFieldDOM, { target: { value: invalidSerialNumber } });

    dispatch(
      updatePairFormParams({
        key: 'serialNumber',
        value: {
          isValid: false,
          value: invalidSerialNumber,
        },
      })
    );
    fireEvent.blur(serialNumberFieldDOM, { target: { value: invalidSerialNumber } });

    // Assert
    expect(mockContainer.innerHTML.includes(adornmentErrorClassName)).toBeTruthy();
  });

  test('should test mode value be able to be toggled', () => {
    // Arrange
    const checkboxClassName = 'Mui-checked';
    const testModeCheckboxDOM = mockContainer.querySelector('[data-test-id="testModeCheckbox"] input');

    // Act
    fireEvent.click(testModeCheckboxDOM, { target: { checked: false } });

    // Assert
    expect(document.body.innerHTML.includes(checkboxClassName)).toBeTruthy();
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

  test('should SPI provider field disabled by default', async () => {
    // Arrange
    const filedDisabledClass = 'Mui-disabled';
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"]');

    // Assert
    expect(paymentProviderFieldDOM.outerHTML.includes(filedDisabledClass)).toBeTruthy();
  });

  test('should payment provider dropdown list changeable', async () => {
    // Arrange
    const handlePaymentProviderOnChange = jest.fn();
    const paymentProviderSelectorDOM = mockContainer.querySelector('[data-test-id="paymentProviderSelector"]');
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^Payment provider/i))[1]);
    fireEvent.click(await screen.findByText(/^Other/i));
    handlePaymentProviderOnChange();

    // Assert
    expect(paymentProviderSelectorDOM).toBeDefined();
    expect(handlePaymentProviderOnChange).toHaveBeenCalledTimes(1);
    expect(paymentProviderFieldDOM.disabled).toBe(false);
  });

  test('should payment provider field value not be empty when select Westpac as payment provider', async () => {
    // Arrange
    const handlePaymentProviderOnChange = jest.fn();
    const handleProviderOptionChange = jest.fn();
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^Payment provider/i))[1]);
    fireEvent.click(await screen.findByText(/^Westpac/i));
    handlePaymentProviderOnChange();
    handleProviderOptionChange();

    // Assert
    expect(paymentProviderFieldDOM.value).toBe('wbc');
    expect(paymentProviderFieldDOM.disabled).toBe(true);
    expect(handleProviderOptionChange).toHaveBeenCalledTimes(1);
  });

  test('should eftpos address field be disabled when eftpos address type is auto', async () => {
    // Arrange
    const handleDeviceAddressTypeOnBlur = jest.fn();
    const handleConfigTypeBlur = jest.fn().mockImplementation(() => {
      setFormState(jest.fn(), 'testMode', true);
    });
    const autoAddressText = 'Auto address';
    const configurationTypeSelectorDOM = mockContainer.querySelector('[data-test-id="configurationTypeSelector"]');
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click(await screen.findByText(/^Auto address/i));
    handleDeviceAddressTypeOnBlur();
    handleConfigTypeBlur();

    // Assert
    expect(configurationTypeSelectorDOM.innerHTML.includes(autoAddressText)).toBeTruthy();
    expect(eftposAddressFieldDOM.disabled).toBe(true);
    expect(handleDeviceAddressTypeOnBlur).toHaveBeenCalled();
    expect(handleConfigTypeBlur).toHaveBeenCalledTimes(1);
  });

  test('should eftpos address field be enabled when eftpos address type is eftpos', async () => {
    // Arrange
    const handleConfigTypeBlur = jest.fn().mockImplementation(() => {
      setFormState(jest.fn(), 'testMode', false);
    });
    const eftposAddressText = 'EFTPOS address';
    const configurationTypeSelectorDOM = mockContainer.querySelector('[data-test-id="configurationTypeSelector"]');
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');
    const testModeCheckboxDOM = mockContainer.querySelector('[data-test-id="testModeCheckbox"]');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click((await screen.findAllByText(/^EFTPOS address/i))[3]);
    handleConfigTypeBlur();

    // Assert
    expect(configurationTypeSelectorDOM.innerHTML.includes(eftposAddressText)).toBeTruthy();
    expect(eftposAddressFieldDOM.disabled).toBe(false);
    expect(testModeCheckboxDOM.innerHTML.includes('checked')).toBeTruthy();
  });

  test('should eftpos address reflects changes after user started typing', () => {
    // Arrange
    const eftposAddressValidator = jest.fn();
    const handleDeviceAddressOnChange = jest.fn().mockImplementation(() => {
      setFormState(jest.fn(), 'deviceAddress', {
        value: eftposAddressValidator(TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE, defaultLocalIP),
      });
    });
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.change(eftposAddressFieldDOM, { target: { value: defaultLocalIP } });
    handleDeviceAddressOnChange();

    // Assert
    expect(handleDeviceAddressOnChange).toHaveBeenCalled();
  });

  test('should get latest eftpos address based on user typings', () => {
    // Arrange
    const handleDeviceAddressOnBlur = jest.fn();
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.change(eftposAddressFieldDOM, { target: { value: defaultLocalIP } });
    handleDeviceAddressOnBlur();
    fireEvent.blur(eftposAddressFieldDOM);

    // Assert
    expect(handleDeviceAddressOnBlur).toHaveBeenCalled();
  });

  test('should function serialNumberFormatter() returns the serial number value in a correct format', () => {
    // Arrange
    const mockRawSerialNumber = '1234';
    const serialNumberFieldDOM = mockContainer.querySelector('[data-test-id="serialNumberField"] input');
    const serialNumberFormatter = jest.fn();
    const handleSerialNumberChange = jest.fn().mockImplementation(() => {
      setFormState(jest.fn(), 'serialNumber', { value: serialNumberFormatter(mockRawSerialNumber) });
    });

    // Act
    fireEvent.change(serialNumberFieldDOM, { target: { value: mockRawSerialNumber } });
    handleSerialNumberChange();

    // Assert
    expect(serialNumberFieldDOM.value).toBe('123-4');
    expect(serialNumberFormatter).toHaveBeenCalled();
    expect(handleSerialNumberChange).toHaveBeenCalled();
  });

  test('should show pair button in pair form screen', () => {
    // Arrange
    const pairButtonText = 'Pair';
    const pairBtnDOM = screen.getByText(pairButtonText);

    // Assert
    expect(pairBtnDOM).toBeInTheDocument();
  });

  test('should show pair button in pair form screen', () => {
    // Arrange
    const pairButtonText = 'Pair';
    const handlePairClick = jest.fn();
    const pairBtnDOM = screen.getByText(pairButtonText);

    // Act
    fireEvent.click(pairBtnDOM);
    handlePairClick();

    // Assert
    expect(handlePairClick).toHaveBeenCalledTimes(1);
  });
});
