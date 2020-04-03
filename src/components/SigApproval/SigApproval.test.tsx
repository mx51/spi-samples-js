import { shallow, mount } from 'enzyme';
import React from 'react';
import SigApproval from './SigApproval';

describe('SigApproval', () => {
  let setShowSigApproval = jest.fn();
  let signatureApprove = jest.fn();
  let component: any;

  beforeEach(() => {
    const show = false;
    const handleClose = jest.fn();
    const spi = jest.fn();
    signatureApprove = jest.fn();
    setShowSigApproval = jest.fn();
    component = mount(
      <SigApproval show={show} handleClose={handleClose} setShowSigApproval={setShowSigApproval} spi={spi} />
    );
  });

  xit('should call setShowSigApproval with default values', () => {
    component.find('button#btnSigApproval').simulate('click');
    expect(signatureApprove.mock.calls[0][0]).toBe(1);
  });
});
