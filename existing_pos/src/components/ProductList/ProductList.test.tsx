import { shallow, mount } from 'enzyme';
import React from 'react';
import { Category } from '../types';

import ProductList from './ProductList';

describe('ProductList', () => {
  let component: any;
  let onProductClick = jest.fn();

  beforeEach(() => {
    const category: Category = {
      categoryName: 'Burger',
      list: [{ id: '101', name: 'veg Burger', image: 'burger.jpg', price: '14' }],
    };
    onProductClick = jest.fn();

    component = mount(<ProductList category={category} onProductClick={onProductClick} />);
  });

  it('should product id when product is clicked in the list', () => {
    component.find('button#btnProductItem101').simulate('click');
    expect(onProductClick.mock.calls[0][0]).toBe('101');
  });
});
