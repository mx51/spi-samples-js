import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import Pair from '.';
import mockWithRedux, { defaultMockPairFormParams, defaultMockTerminals } from '../../utils/tests/common';

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

  test('should show "contentShift" class name when showFlowPanel value has been set as true', () => {
    // Arrange
    const customizedStore = {
      getState: () => ({
        common: { showFlowPanel: true },
        pairForm: defaultMockPairFormParams,
        terminals: defaultMockTerminals,
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };

    const mockContainer = mockWithRedux(<Pair />, customizedStore);

    // Assert
    expect(mockContainer.innerHTML.includes('contentShift')).toBeTruthy();
  });
});
