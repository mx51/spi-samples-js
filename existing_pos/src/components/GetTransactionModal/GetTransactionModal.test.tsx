import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import GetTransactionModal from './GetTransactionModal';

describe('GetTransactionModal', () => {
  const show = true;
  const handleClose = jest.fn();
  const handleGetTransaction = jest.fn();
  const posRefId = 'posRefId';
  const setPosRefId = jest.fn();
  let component: ReactWrapper<JSX.Element>;

  beforeEach(() => {
    component = mount(
      <GetTransactionModal
        show={show}
        handleClose={handleClose}
        handleGetTransaction={handleGetTransaction}
        posRefId={posRefId}
        setPosRefId={setPosRefId}
      />
    );
  });

  it('should call handleClose when closing the modal', () => {
    component.find('button.close').simulate('click');
    expect(handleClose).toBeCalled();
  });

  it('should call setPosRefId when the posRefId input is updated', () => {
    const updatedValue = 'purchasePosRefId';
    component.find('input#posRefId').simulate('change', { target: { value: updatedValue } });
    expect(setPosRefId).toBeCalledWith(updatedValue);
  });

  it('should call handleGetTransaction when btnGetTransaction is clicked', () => {
    component.find('button#btnGetTransaction').simulate('click');
    expect(handleGetTransaction).toBeCalledWith(posRefId, setPosRefId);
  });
});
