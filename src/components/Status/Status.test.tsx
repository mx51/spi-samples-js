import { shallow, mount } from 'enzyme';
import { SpiStatus } from '@mx51/spi-client-js';
import React from 'react';
import Status from './Status';

describe('Status', () => {
  it('should show message Paired connected', () => {
    const component = mount(
      <Status pairButton={false} status={SpiStatus.PairedConnected} isFinishedPairing spi={{}} Message="" />
    );
    const msg = component.find('#alertMessage > div').text();

    expect(msg).toBe('Paired connected');
  });

  it('should show message attempting to connect when Paired connecting', () => {
    const component = mount(
      <Status pairButton={false} status={SpiStatus.PairedConnecting} isFinishedPairing spi={{}} Message="" />
    );
    const msg = component.find('#alertMessage > div').text();

    expect(msg).toBe('Attempting to Connect');
  });

  it('should show message when not connected', () => {
    const component = mount(
      <Status pairButton={false} status="Not connected" isFinishedPairing={false} spi={{}} Message="" />
    );
    const msg = component.find('#alertMessage > div').text();

    expect(msg).toBe('Unpaired');
  });

  it('should show default message when unpaired and not finished', () => {
    const component = mount(
      <Status
        pairButton={false}
        status={SpiStatus.Unpaired}
        isFinishedPairing={false}
        spi={{}}
        Message="My default message"
      />
    );
    const msg = component.find('#alertMessage > div').text();

    expect(msg).toBe('My default message');
  });

  it('should show cancel pairing button when unpaired and not finished', () => {
    const component = mount(
      <Status
        pairButton={false}
        status={SpiStatus.Unpaired}
        isFinishedPairing={false}
        spi={{}}
        Message="My default message"
      />
    );

    expect(component.find('button#btnCancelPairing').exists()).toBe(true);
    expect(component.find('button#btnPair').exists()).toBe(false);
    expect(component.find('button#btnUnpair').exists()).toBe(false);
  });

  it('should show pair button when unpaired and finished pairing', () => {
    const component = mount(
      <Status pairButton={false} status={SpiStatus.Unpaired} isFinishedPairing spi={{}} Message="My default message" />
    );

    expect(component.find('button#btnCancelPairing').exists()).toBe(false);
    expect(component.find('button#btnPair').exists()).toBe(true);
    expect(component.find('button#btnUnpair').exists()).toBe(false);
  });

  it('should show unpaired button when paired and finished pairing', () => {
    const component = mount(
      <Status
        pairButton={false}
        status={SpiStatus.PairedConnected}
        isFinishedPairing
        spi={{}}
        Message="My default message"
      />
    );

    expect(component.find('button#btnCancelPairing').exists()).toBe(false);
    expect(component.find('button#btnPair').exists()).toBe(false);
    expect(component.find('button#btnUnpair').exists()).toBe(true);
  });
});
