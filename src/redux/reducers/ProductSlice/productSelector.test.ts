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
      keypadAmount: 0,
      surchargeAmount: 100,
      tipAmount: 100,
      cashoutAmount: 100,
      promptForCashout: false,
      products: [
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productsSelector(state)).toEqual([
    { quantity: 1, product: { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' } },
    { quantity: 1, product: { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' } },
  ]);
});

test('should return product quantity for duplicate product', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 0,
      surchargeAmount: 100,
      tipAmount: 100,
      cashoutAmount: 100,
      promptForCashout: false,
      products: [
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productsSelector(state)).toEqual([
    { quantity: 3, product: { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' } },
    { quantity: 2, product: { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' } },
  ]);
});

test('should return keypad amount as subtotal amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 500,
      surchargeAmount: 100,
      tipAmount: 120,
      cashoutAmount: 110,
      promptForCashout: false,
      products: [],
    },
  };
  expect(productSubTotalSelector(state)).toEqual(500);
});

test('should add all the price and display subtotal', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 0,
      surchargeAmount: 100,
      tipAmount: 100,
      cashoutAmount: 100,
      promptForCashout: false,
      products: [
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 1, name: 'Mocha', price: 500, image: 'Mocha.jpeg' },
        { id: 2, name: 'Latte', price: 450, image: 'Latte.jpeg' },
      ],
    },
  };
  expect(productSubTotalSelector(state)).toEqual(2400);
});

test('should get surcharge amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 0,
      surchargeAmount: 155,
      tipAmount: 125,
      cashoutAmount: 0,
      promptForCashout: false,
      products: [],
    },
  };
  expect(orderSurchargeAmountSelector(state)).toEqual(155);
});

test('should get tip amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 0,
      surchargeAmount: 155,
      tipAmount: 125,
      cashoutAmount: 0,
      promptForCashout: false,
      products: [],
    },
  };
  expect(orderTipAmountSelector(state)).toEqual(125);
});

test('should get cashout amount', () => {
  const state = {
    pair: { status: '' },
    terminals: {},
    products: {
      keypadAmount: 0,
      surchargeAmount: 155,
      tipAmount: 0,
      cashoutAmount: 125,
      promptForCashout: false,
      products: [],
    },
  };
  expect(orderCashoutAmountSelector(state)).toEqual(125);
});
