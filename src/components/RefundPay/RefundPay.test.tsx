import { shallow, mount } from 'enzyme';
import React from 'react';
import RefundPay from './RefundPay';

describe('RefundPay', () => {
  let handleRefundPay = jest.fn();
  let component: any;

  beforeEach(() => {
    handleRefundPay = jest.fn();
    component = shallow(<RefundPay handleRefundPay={handleRefundPay} />);
  });

  it('should return 0 when refund button clicked without entering value', () => {
    component.find('button').simulate('click');
    expect(handleRefundPay.mock.calls.length).toBe(1);
    expect(handleRefundPay.mock.calls[0][0]).toBe(0);
  });

  it('should return $1 when refund button clicked after entering value 100 cents', () => {
    component.find('#Refund-Amount').simulate('change', { target: { value: 100 } });

    component.find('button').simulate('click');
    expect(handleRefundPay.mock.calls[0][0]).toBe(1);
  });

  it('should return $1 when refund button clicked after entering value 100 cents', () => {
    component.find('#Refund-Amount').simulate('change', { target: { value: 100 } });
    component.find('button').simulate('click');
    expect(handleRefundPay.mock.calls[0][0]).toBe(1);
  });
});
