import { shallow, mount } from 'enzyme';
import React from 'react';
import CashOutPay from './CashOutPay';

describe('CashOutPay', () => {
  it('should return 0 when cash out button clicked without entering value', () => {
    const handleCashoutPay = jest.fn();
    const component = shallow(<CashOutPay handleCashoutPay={handleCashoutPay} />);

    component.find('button#cashoutButton').simulate('click');
    expect(handleCashoutPay.mock.calls[0][0]).toBe(0);
  });

  it('should return $1 when cash out button clicked after entering value 100 cents', () => {
    const handleCashoutPay = jest.fn();
    const component = mount(<CashOutPay handleCashoutPay={handleCashoutPay} />);

    component
      .find('input#inpCashoutAmount')
      .at(0)
      .simulate('change', { target: { value: -100 } });

    component.find('button').simulate('click');
    expect(handleCashoutPay.mock.calls[0][0]).toBe(-1);
  });
});
