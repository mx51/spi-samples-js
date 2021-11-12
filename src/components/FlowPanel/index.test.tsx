import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import FlowPanel from '.';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';
import { ITerminalState } from '../../redux/reducers/TerminalSlice/interfaces';
import mockWithRedux, { defaultMockPairFormParams, pairedMockTerminals } from '../../utils/tests/common';

function setupContainer(
  pairForm: IPairFormParams = defaultMockPairFormParams,
  terminals: ITerminalState = pairedMockTerminals
) {
  const customizedStore = {
    getState: () => ({
      common: { showFLowPanel: true, acquireConfirmPairingFlow: true },
      pairForm,
      terminals,
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  return mockWithRedux(
    <FlowPanel>
      <h6>Flow</h6>
      <p>Mock flow panel content</p>
    </FlowPanel>,
    customizedStore
  );
}

describe('Test <FlowPanel />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    mockContainer = setupContainer();
  });

  afterEach(cleanup);

  test('should match FlowPanel snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });
});
