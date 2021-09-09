import {
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productsSelector,
  productSubTotalSelector,
} from './productSelector';

test('should return product quantity for list', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 0,
      tipAmount: 0,
      cashoutAmount: 0,
      products: [
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productsSelector(state)).toEqual([
    { quantity: 1, product: { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' } },
    { quantity: 1, product: { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' } },
  ]);
});

test('should return product quantity for duplicate product', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 0,
      tipAmount: 0,
      cashoutAmount: 0,
      products: [
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' },
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productsSelector(state)).toEqual([
    { quantity: 3, product: { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' } },
    { quantity: 2, product: { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' } },
  ]);
});

test('should add all the price and display subtotal', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 0,
      tipAmount: 0,
      cashoutAmount: 0,
      products: [
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' },
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 1, name: 'Mocha', price: 5, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 4.5, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productSubTotalSelector(state)).toEqual(24);
});

test('should get surcharge amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 15.5,
      tipAmount: 12.5,
      cashoutAmount: 0,
      products: [],
    },
  };
  expect(orderSurchargeAmountSelector(state)).toEqual(15.5);
});

test('should get tip amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 15.5,
      tipAmount: 12.5,
      cashoutAmount: 0,
      products: [],
    },
  };
  expect(orderTipAmountSelector(state)).toEqual(12.5);
});

test('should get cashout amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      surchargeAmount: 15.5,
      tipAmount: 0,
      cashoutAmount: 5.65,
      products: [],
    },
  };
  expect(orderCashoutAmountSelector(state)).toEqual(5.65);
});
