import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import OrderLineItem from '.';

describe('Test <OrderLineItem />', () => {
  test('snapshot for OrderLineItem component', () => {
    const onAdd = jest.fn();

    const { container } = render(<OrderLineItem label="Tip" amount={50} onAdd={onAdd} disabled={false} />);
    expect(container).toMatchSnapshot();
  });
});
