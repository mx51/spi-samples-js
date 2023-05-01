import { handleKeyPress } from './SurchargeModal';

describe('SurchargeModal', () => {
  it('should call handleKeyPress when value entered is 0', () => {
    const event = { key: '0', preventDefault: () => {} } as any;
    const returnValue = handleKeyPress(event);
    expect(returnValue).toBeTruthy();
  });

  it(' should call handleKeyPress when value entered is # and prompt the alert', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const event = { key: '#', preventDefault: () => {} } as any;
    const returnValue = handleKeyPress(event);
    expect(returnValue).toBeFalsy();
    expect(window.alert).toBeCalled();
  });
});
