import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '.';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, { defaultMockPairFormParams, defaultMockTerminals } from '../../utils/tests/common';

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = defaultMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      common: { showFLowPanel: false },
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<Navbar />, customizedStore);
}

describe('Test <Navbar />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
  });

  afterEach(cleanup);

  test('should contain PageLogoIcon', () => {
    // Assert
    expect(mockContainer).toBeDefined();
    expect(mockContainer.innerHTML.includes('svg')).toBeTruthy();
  });

  test('should be able to view drawer title when PageLogoIcon get clicked', () => {
    // Arrange
    const navbarMenuIconDOM = mockContainer.querySelector('[data-test-id="navbarMenuIcon"]');

    // Act
    fireEvent.click(navbarMenuIconDOM);

    // Assert
    expect(document.body).toHaveTextContent(/Sample POS/i);
  });
});
