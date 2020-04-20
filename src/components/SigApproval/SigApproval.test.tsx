import { mount } from 'enzyme';
import React from 'react';
import SigApproval from './SigApproval';

describe('SigApproval', () => {
  let handleApproveSig = jest.fn();
  let component: any;

  beforeEach(() => {
    const show = true;
    const handleClose = jest.fn();
    handleApproveSig = jest.fn();
    component = mount(<SigApproval show={show} handleClose={handleClose} handleApproveSig={handleApproveSig} />);
  });

  it('should call handleApproveSig with true when approved', () => {
    component.find('button#btnSigApproval').simulate('click');
    expect(handleApproveSig.mock.calls[0][0]).toBe(true);
  });
  it('should call handleApproveSig with false when declined', () => {
    component.find('button#btnSigDecline').simulate('click');
    expect(handleApproveSig.mock.calls[0][0]).toBe(false);
  });
});
