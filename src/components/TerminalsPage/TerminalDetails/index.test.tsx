import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import TerminalDetails from '.';
import { ITerminalState } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import spiService from '../../../services/spiService';
import mockWithRedux, { mockTerminalInstanceId, pairedMockTerminals } from '../../../utils/tests/common';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: `/terminals/${mockTerminalInstanceId}`,
  }),
}));

function setupContainer(terminals: ITerminalState = pairedMockTerminals) {
  spiService.spiHardwarePrinterAvailable = jest.fn().mockReturnValue(false);
  const customizedStore = {
    getState: () => ({
      common: {},
      pairForm: {
        serialNumber: {
          value: mockTerminalInstanceId,
          isValid: true,
        },
      },
      products: [],
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(<TerminalDetails />, customizedStore);
}

describe('Test <TerminalDetails />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('should match TerminalDetails snapshot tes', () => {
    // Arrange
    const subtitle = 'View information about this terminal and the pairing configuration';
    const useAppSelector = jest.fn();

    // Act
    useAppSelector.mockImplementation(terminalInstance(mockTerminalInstanceId));

    // Assert
    expect(mockContainer).toMatchSnapshot();
    expect(mockContainer.innerHTML.includes(subtitle)).toBeTruthy();
  });

  test('should should Page not found', () => {
    // Arrange
    const mockTerminalId = '234-234-234';
    const mockTitle = 'Page not found';
    const useAppSelector = jest.fn();

    const customizedStore = {
      getState: () => ({
        common: {},
        pairForm: {},
        products: [],
        terminals: {},
      }),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };

    // Act
    const containerWrapper = mockWithRedux(<TerminalDetails />, customizedStore);
    useAppSelector.mockImplementation(terminalInstance(mockTerminalId));

    // Assert
    expect(containerWrapper.innerHTML.includes(mockTitle)).toBeTruthy();
  });

  test('should be toggle-able when clicks different tab', () => {
    // Arrange
    const payAtTableClickedDOM =
      '<button class="MuiButtonBase-root MuiTab-root MuiTab-textColorInherit Mui-selected" tabindex="0" type="button" role="tab" aria-selected="true" id="payAtTableTab"><span class="MuiTab-wrapper">Pay at Table</span><span class="MuiTouchRipple-root"></span></button>';
    const tabActiveProof = 'aria-selected="true"';

    const terminalDetailsTabsDOM = mockContainer.querySelector('#terminalDetailsTabs');
    const payAtTableTabDOM = mockContainer.querySelector('#payAtTableTab');

    // Act
    fireEvent.change(terminalDetailsTabsDOM);
    fireEvent.click(payAtTableTabDOM);

    // Assert
    expect(payAtTableClickedDOM.includes(tabActiveProof)).toBe(true);
  });
});
