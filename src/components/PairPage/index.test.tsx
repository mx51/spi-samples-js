import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent } from '@testing-library/react';
import Pair from '.';
import mockWithRedux from '../../utils/tests/common';

describe('Test <Pair />', () => {
  let pairContainer: Any;

  beforeEach(() => {
    pairContainer = mockWithRedux(<Pair />);
  });

  afterEach(cleanup);

  test('should contain Pair Page headings', () => {
    // Arrange
    const pageHeadings = ['Payment type', 'Pairing configuration', 'Pairing status', 'Flow'];

    // Assert
    for (let index = 0; index < pageHeadings.length; index += 1) {
      expect(pairContainer.getElementsByTagName('h1')[index]).toHaveTextContent(pageHeadings[index]);
    }
  });

  test('should render empty string of currentSessionId after page refreshed', () => {
    // Arrange
    const hiddenStylingText = 'visibility: hidden;';
    const flowTogglerDOM = pairContainer.querySelector('[data-test-id="flowToggler"]');

    // Act
    fireEvent.click(flowTogglerDOM);

    // Assert
    expect(pairContainer.innerHTML.includes(hiddenStylingText)).toBeFalsy();
  });

  test('should be able to toggle flow panel', () => {
    // Arrange
    const flowTogglerDOM = pairContainer.querySelector('[data-test-id="flowToggler"]');

    // Act
    fireEvent.click(flowTogglerDOM);
    const flowPanelDOM = pairContainer.querySelector('[data-test-id="flowPanel"]');

    // Assert
    expect(flowPanelDOM.innerHTML).toBeDefined();
  });
});
