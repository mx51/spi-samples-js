import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import Product from '.';

describe('Test <Product />', () => {
  test('snapshot for Product component', () => {
    const product = {
      name: 'Mocha',
      price: 420,
      image: 'images/product/mocha.png',
    };
    const onClick = jest.fn();

    const { container } = render(<Product product={product} onClick={onClick} />);
    expect(container).toMatchSnapshot();
  });
});
