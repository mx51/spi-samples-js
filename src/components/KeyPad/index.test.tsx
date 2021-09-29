import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import KeyPad from '.';

describe('Test <KeyPad />', () => {
  test('snapshot for KeyPad component', () => {
    const onAmountChange = jest.fn();
    const onClose = jest.fn();

    const { container } = render(
      <KeyPad title="Surcharge" defaultAmount={0} onAmountChange={onAmountChange} open={false} onClose={onClose} />
    );
    expect(container).toMatchSnapshot();
  });

  test('Amount change on Ok button click', () => {
    const onAmountChange = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <KeyPad title="Surcharge" defaultAmount={50} onAmountChange={onAmountChange} open={false} onClose={onClose} />
    );

    fireEvent.click(getByText(/ok/i));

    expect(onAmountChange.mock.calls.length).toBe(1);
    expect(onAmountChange.mock.calls[0][0]).toBe(50);
  });

  test('Amount change on keypad & Ok button click', () => {
    const onAmountChange = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <KeyPad title="Surcharge" defaultAmount={0} onAmountChange={onAmountChange} open={false} onClose={onClose} />
    );

    fireEvent.click(getByText(/7/i));
    fireEvent.click(getByText(/2/i));
    fireEvent.click(getByText(/ok/i));

    expect(onAmountChange.mock.calls.length).toBe(1);
    expect(onAmountChange.mock.calls[0][0]).toBe(7200);
  });

  test('Amount change on keydown & Enter', () => {
    const onAmountChange = jest.fn();
    const onClose = jest.fn();
    const { container } = render(
      <KeyPad title="Surcharge" defaultAmount={0} onAmountChange={onAmountChange} open={false} onClose={onClose} />
    );

    fireEvent.keyDown(container, { key: '4' });
    fireEvent.keyDown(container, { key: '.' });
    fireEvent.keyDown(container, { key: '5' });
    fireEvent.keyDown(container, { key: 'Enter' });

    expect(onAmountChange.mock.calls.length).toBe(1);
    expect(onAmountChange.mock.calls[0][0]).toBe(450);
  });
});
