import React from 'react';
import { cleanup } from '@testing-library/react';
import PaymentType from '.';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../../../utils/tests/common';

describe('Test <PaymentType />', () => {
  afterEach(cleanup);

  test('should match PaymentType snapshot test', () => {
    // Arrange
    const terminal = defaultMockTerminals[mockTerminalInstanceId];
    const container = mockWithRedux(<PaymentType terminal={terminal} />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
