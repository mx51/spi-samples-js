import React from 'react';
import * as redux from 'react-redux';
import OrderFinished from '.';

import mockWithRedux from '../../utils/tests/common';

describe('Test <OrderFinished />', () => {
  test('snapshot for OrderFinishedPage component', () => {
    const spySelector = jest.spyOn(redux, 'useSelector');
    spySelector.mockReturnValue({
      posId: '123',
      txFlow: {
        finished: true,
        success: 'Success',
        request: {
          data: {
            purchaseAmount: 550,
            surchargeAmount: 100,
            cashAmount: 200,
            tipAmount: 150,
          },
        },
        response: {
          data: {
            merchantReceipt: 'jfkgjf',
          },
        },
      },
    });
    const { container } = mockWithRedux(<OrderFinished />);
    expect(container).toMatchSnapshot();
  });
});
