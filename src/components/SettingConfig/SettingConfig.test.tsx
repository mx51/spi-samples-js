import { shallow, mount } from 'enzyme';
import React from 'react';
import SettingConfig from './SettingConfig';

describe('SettingConfig', () => {
  let component: any;
  let handleSaveSetting = jest.fn();
  beforeEach(() => {
    const suppressMerchantPassword = false;
    const setSuppressMerchantPassword = jest.fn();
    handleSaveSetting = jest.fn();
    component = mount(
      <SettingConfig
        handleSaveSetting={handleSaveSetting}
        suppressMerchantPassword={suppressMerchantPassword}
        setSuppressMerchantPassword={setSuppressMerchantPassword}
      />
    );
  });

  it('should call setShowSigApproval with default values', () => {
    component.find('textarea#receipt-header').simulate('change', { target: { value: 'This is header' } });
    component.find('textarea#receipt-footer').simulate('change', { target: { value: 'This is footer' } });
    component.find('input#check-receipt-eftpos').simulate('change', { target: { checked: false } });
    component.find('input#check-sig-eftpos').simulate('change', { target: { checked: false } });
    component.find('input#print-merchant-copy').simulate('change', { target: { checked: false } });
    component.find('input#suppress-merchant-password').simulate('change', { target: { checked: false } });

    component.find('button#btnApply').simulate('click');

    expect(handleSaveSetting.mock.calls[0][0]).toBe(false);
    expect(handleSaveSetting.mock.calls[0][1]).toBe(false);
    expect(handleSaveSetting.mock.calls[0][2]).toBe(false);
    expect(handleSaveSetting.mock.calls[0][3]).toBe('This is header');
    expect(handleSaveSetting.mock.calls[0][4]).toBe('This is footer');

    // expect(spi.setApiKey.mock.calls[0][0]).toBe('RamenPosDeviceIpApiKey');
    // expect(spi.setSerial.mock.calls[0][0]).toBe('123-123-123');
    // // expect(spi.setEftpos.mock.calls[0][0]).toBe('123.12.12.12');
    // expect(spi.setTestMode.mock.calls[0][0]).toBe(false);
    // expect(spi.setSecureWebSocket.mock.calls[0][0]).toBe(false);
    // expect(spi.setAutoAddress.mock.calls[0][0]).toBe(false);
  });
});
