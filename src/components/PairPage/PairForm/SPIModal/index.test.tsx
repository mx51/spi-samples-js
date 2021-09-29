import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent } from '@testing-library/react';
import SPIModal from '.';
import { IPairFormParams } from '../../../../redux/reducers/PairFormSlice/interfaces';
import mockWithRedux, { defaultMockPairFormParams } from '../../../../utils/tests/common';

function setupContainer(pairForm: IPairFormParams = defaultMockPairFormParams) {
  const customizedStore = {
    getState: () => ({
      pairForm,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(
    <SPIModal
      modalToggle
      handleProviderChange={jest.fn()}
      onClose={jest.fn()}
      providerValue={pairForm.acquirerCode.value}
    />,
    customizedStore
  );
}

describe('Test <SPIModal />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
  });

  afterEach(cleanup);

  test('should match SPIModal snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should display modal title', () => {
    // In terms of React Portal, the modal dialog is not visible in container dom, but which can be found within document DOM tree
    // Arrange
    const title = 'Simple Payments Integration';

    // Assert
    expect(document.body.innerHTML.includes(title)).toBeTruthy();
  });

  test('should show pre-selected radio button', () => {
    // Arrange
    const checkedClassName = 'Mui-checked';
    const wbcRadioBtnDOM = document.body.querySelector('[data-test-id="wbc"]') as Element;

    // Act
    fireEvent.click(wbcRadioBtnDOM);

    // Assert
    expect(wbcRadioBtnDOM.innerHTML.includes(checkedClassName)).toBeTruthy();
  });

  test('should show the updated selected radio button', () => {
    // Arrange
    const updatedFormParams = {
      ...defaultMockPairFormParams,
      acquirerCode: {
        ...defaultMockPairFormParams.acquirerCode,
        value: 'other',
      },
    };
    const checkedClassName = 'Mui-checked';
    const checkedKeyword = 'checked';

    // Act
    setupContainer(updatedFormParams);

    const otherOptionDOM = document.body.querySelector('[data-test-id="other"]');
    const wbcOptionDOM = document.body.querySelector('[data-test-id="wbc"]');

    // Assert
    expect(otherOptionDOM?.innerHTML.includes(checkedClassName)).toBeTruthy();
    expect(wbcOptionDOM?.innerHTML.includes(checkedKeyword)).toBeFalsy();
  });
});
