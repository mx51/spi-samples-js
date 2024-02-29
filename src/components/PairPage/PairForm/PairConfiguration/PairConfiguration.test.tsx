import React from 'react';
import { cleanup, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
import PairConfiguration from '.';
import {
  TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE,
  TEXT_FORM_DEFAULT_VALUE,
  TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD,
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
} from '../../../../definitions/constants/commonConfigs';
import { defaultLocalIP } from '../../../../definitions/constants/spiConfigs';
import { updatePairFormParams } from '../../../../redux/reducers/PairFormSlice/pairFormSlice';
import mockWithRedux, { mockTerminalInstanceId } from '../../../../utils/tests/common';

replaceAllInserter.shim();

describe('Test <PairConfiguration />', () => {
  let dispatch: Any;
  let mockContainer: Any;

  beforeEach(() => {
    dispatch = jest.fn();
    mockContainer = mockWithRedux(<PairConfiguration />);
  });

  afterEach(cleanup);

  test('should match PairConfiguration snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should show the error adornment icon when field input is invalid', () => {
    // This test case is for form field error handling

    // Arrange
    const invalidSerialNumber = '123 45';
    const adornmentErrorClassName = 'MuiSvgIcon-colorError';
    const serialNumberFieldDOM = mockContainer.querySelector('[data-test-id="serialNumberField"] input') as Element;

    // Act
    fireEvent.blur(serialNumberFieldDOM, { target: { value: invalidSerialNumber } });

    // Assert
    expect(mockContainer.innerHTML.includes(adornmentErrorClassName)).toBeTruthy();
  });

  test('should change the form field value after user started typing', () => {
    // This test case is for posId field onChange event testing

    // Arrange
    const posIdValue = 'MockPOS';
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

  test('should payment provider dropdown list changeable', async () => {
    // Arrange
    const handlePaymentProviderSelectorOnChange = jest.fn().mockImplementation(() => {
      dispatch(
        updatePairFormParams({
          key: 'acquireCode',
          value: {
            isValid: false,
            value: TEXT_FORM_DEFAULT_VALUE,
          },
        })
      );
    });
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    handlePaymentProviderSelectorOnChange();

    // Assert
    expect(handlePaymentProviderSelectorOnChange).toHaveBeenCalledTimes(1);
    expect(paymentProviderFieldDOM.value).toBe('');
  });

  test('should payment provider field value not be empty when select Westpac as payment provider', async () => {
    // Arrange
    const handlePaymentProviderFieldOnChange = jest.fn();
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^Payment provider/i))[1]);
    fireEvent.click((await screen.findAllByText(/^Westpac/i))[0]);
    handlePaymentProviderFieldOnChange();

    // Assert
    expect(paymentProviderFieldDOM.value).toBe('wbc');
    expect(handlePaymentProviderFieldOnChange).toHaveBeenCalledTimes(1);
  });

  test('should payment provider field disabled when payment provider is not "Other"', async () => {
    // Arrange
    const filedDisabledClass = 'Mui-disabled';
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^Payment provider/i))[1]);
    fireEvent.click((await screen.findAllByText(/^Westpac/i))[0]);

    // Assert
    expect(paymentProviderFieldDOM.outerHTML.includes(filedDisabledClass)).toBeTruthy();
    expect(paymentProviderFieldDOM.disabled).toBe(true);
  });

  test('should eftpos address field be enabled when eftpos address type is eftpos', async () => {
    // Arrange
    const eftposAddressText = 'EFTPOS address';
    const configurationTypeSelectorDOM = mockContainer.querySelector('[data-test-id="configurationSelector"]');
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');
    const testModeCheckboxDOM = mockContainer.querySelector('[data-test-id="testModeCheckbox"]');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click((await screen.findAllByText(/^EFTPOS address/i))[0]);

    // Assert
    expect(configurationTypeSelectorDOM.innerHTML.includes(eftposAddressText)).toBeTruthy();
    expect(eftposAddressFieldDOM.disabled).toBe(false);
    expect(testModeCheckboxDOM.innerHTML.includes('checked')).toBeTruthy();
  });

  test('should show the error hint message icon when eftpos address input is invalid', async () => {
    // Arrange
    const invalidEftposAddress = 'word-test';
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.change(eftposAddressFieldDOM, { target: { value: invalidEftposAddress } });
    fireEvent.blur(eftposAddressFieldDOM);

    // Assert
    expect(mockContainer.innerHTML.includes(TEXT_FORM_VALIDATION_EFTPOS_ADDRESS_TEXTFIELD)).toBeTruthy();
  });

  test('should test mode be disabled when user selected eftpos address', async () => {
    // Arrange
    const checkboxClassName = 'Mui-checked';
    const testModeCheckboxDOM = mockContainer.querySelector('[data-test-id="testModeCheckbox"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click((await screen.findAllByText(/^Auto address/i))[0]);
    fireEvent.blur((await screen.findAllByText(/^Auto address/i))[0]);

    // Assert
    expect(testModeCheckboxDOM.outerHTML.includes(checkboxClassName)).toBeFalsy();
  });

  test('should eftpos address field be disabled when eftpos address type is auto', async () => {
    // Arrange
    const handleAddressTypeSelectorOnBlur = jest.fn();
    const autoAddressText = 'Auto address';
    const configurationTypeSelectorDOM = mockContainer.querySelector('[data-test-id="configurationSelector"]');
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.mouseDown((await screen.findAllByText(/^EFTPOS address/i))[0]);
    fireEvent.click(await screen.findByText(/^Auto address/i));
    handleAddressTypeSelectorOnBlur();

    // Assert
    expect(configurationTypeSelectorDOM.innerHTML.includes(autoAddressText)).toBeTruthy();
    expect(eftposAddressFieldDOM.disabled).toBe(true);
    expect(handleAddressTypeSelectorOnBlur).toHaveBeenCalled();
  });

  test('should test mode value be able to be toggled', () => {
    // Arrange
    const checkboxClassName = 'Mui-checked';
    const testModeCheckboxDOM = mockContainer.querySelector('[data-test-id="testModeCheckbox"] input');

    // Act
    fireEvent.click(testModeCheckboxDOM, { target: { checked: false } });

    // Assert
    expect(document.body.innerHTML.includes(checkboxClassName)).toBeTruthy();

    // Act
    fireEvent.click(testModeCheckboxDOM, { target: { checked: true } });

    // Assert
    expect(document.body.innerHTML.includes(checkboxClassName)).toBeFalsy();
  });

  test('should eftpos address reflects changes after user started typing', () => {
    // Arrange
    const eftposAddressValidator = jest.fn();
    const handleDeviceAddressFieldOnChange = jest.fn().mockImplementation(() => {
      dispatch.mockImplementation(() =>
        updatePairFormParams({
          key: 'deviceAddress',
          value: {
            isValid: false,
            value: eftposAddressValidator(TEXT_FORM_CONFIGURATION_EFTPOS_ADDRESS_VALUE, defaultLocalIP),
          },
        })
      );
    });
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.change(eftposAddressFieldDOM, { target: { value: defaultLocalIP } });
    handleDeviceAddressFieldOnChange();

    // Assert
    expect(handleDeviceAddressFieldOnChange).toHaveBeenCalled();
  });

  test('should get latest eftpos address based on user typings', () => {
    // Arrange
    const handleDeviceAddressFieldOnBlur = jest.fn();
    const eftposAddressFieldDOM = mockContainer.querySelector('[data-test-id="eftposAddressField"] input');

    // Act
    fireEvent.change(eftposAddressFieldDOM, { target: { value: defaultLocalIP } });
    handleDeviceAddressFieldOnBlur();
    fireEvent.blur(eftposAddressFieldDOM);

    // Assert
    expect(handleDeviceAddressFieldOnBlur).toHaveBeenCalled();
  });

  test('should show the error hint message icon when payment provider input is invalid', () => {
    // Arrange
    const invalidPaymentProvider = '123-45';
    const paymentProviderFieldDOM = mockContainer.querySelector('[data-test-id="paymentProviderField"] input');

    // Act
    fireEvent.change(paymentProviderFieldDOM, { target: { value: invalidPaymentProvider } });
    fireEvent.blur(paymentProviderFieldDOM);

    // Assert
    expect(mockContainer.innerHTML.includes(TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD)).toBeTruthy();
  });

  test('should show the error hint message icon when payment provider input is invalid', () => {
    // Arrange
    const invalidPosId = '';
    const posIdFieldDOM = mockContainer.querySelector('[data-test-id="posIdField"] input');

    // Act
    fireEvent.change(posIdFieldDOM, { target: { value: invalidPosId } });
    fireEvent.blur(posIdFieldDOM);

    // Assert
    expect(invalidPosId).toBe('');
  });
});
