import React from 'react';
import { cleanup } from '@testing-library/react';
import PairConfiguration from '.';
import { initialSpiFormData } from '../../../../utils/common/pair/pairFormHelpers';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../../../utils/tests/common';

describe('Test <PairConfiguration />', () => {
  afterEach(cleanup);

  test('should match PairConfiguration snapshot test', () => {
    // Arrange
    const setSpi = jest.fn();
    const terminal = defaultMockTerminals[mockTerminalInstanceId];
    const container = mockWithRedux(<PairConfiguration setSpi={setSpi} spi={initialSpiFormData} terminal={terminal} />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
