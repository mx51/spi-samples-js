import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '.';
import { toggleFlowPanel } from '../../redux/reducers/CommonSlice/commonSlice';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, { defaultMockPairFormParams, defaultMockTerminals } from '../../utils/tests/common';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/refund',
  }),
}));

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = defaultMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      common: {},
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

  test('should be able to toggle flow panel', () => {
    // Arrange
    const dispatch = jest.fn();
    const developerModeSwitchDOM = mockContainer.querySelector('[name="developerModeSwitch"]');

    // Act
    fireEvent.click(developerModeSwitchDOM);
    dispatch(toggleFlowPanel(true));

    // Assert
    expect(dispatch).toHaveBeenCalled();
    expect(developerModeSwitchDOM).toBeChecked();
  });

  test('should developer mode button disabled on refund page', () => {
    // Arrange
    const disabledClass = 'Mui-disabled';
    const developerModeSwitchDOM = mockContainer.querySelector('[data-test-id="developerModeSwitch"]');

    // Assert
    expect(developerModeSwitchDOM.outerHTML.includes(disabledClass)).toBe(true);
  });
});
