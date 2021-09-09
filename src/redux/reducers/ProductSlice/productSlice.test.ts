import { IProductState } from './interfaces';
import reducer, { addProduct, clearAllProducts } from './productSlice';

test('should handle add product', () => {
  const previousState: IProductState = [];
  const action = { product: { id: 1, name: 'Latte', price: 3.6, image: 'Latte.jpeg' } };
  expect(reducer(previousState, addProduct(action))).toEqual([
    {
      id: 1,
      name: 'Latte',
      price: 3.6,
      image: 'Latte.jpeg',
    },
  ]);
});

test('should handle clear products', () => {
  const previousState: IProductState = [
    {
      id: 1,
      name: 'Latte',
      price: 4,
      image: 'Latte.jpeg',
    },
    {
      id: 2,
      name: 'Chai Latte',
      price: 3.6,
      image: 'ChaiLatte.jpeg',
    },
  ];
  expect(reducer(previousState, clearAllProducts())).toEqual([]);
});
