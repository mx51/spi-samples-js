import { IProductState } from './interfaces';
import reducer, {
  addCashoutAmount,
  addProduct,
  addSurchargeAmount,
  addTipAmount,
  clearAllProducts,
} from './productSlice';

test('should handle add product', () => {
  const previousState: IProductState = {
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  };
  const action = { product: { id: 1, name: 'Latte', price: 360, image: 'Latte.jpeg' } };
  expect(reducer(previousState, addProduct(action))).toEqual({
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [
      {
        id: 1,
        name: 'Latte',
        price: 360,
        image: 'Latte.jpeg',
      },
    ],
  });
});

test('should handle clear products', () => {
  const previousState: IProductState = {
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [
      {
        id: 1,
        name: 'Latte',
        price: 400,
        image: 'Latte.jpeg',
      },
      {
        id: 2,
        name: 'Chai Latte',
        price: 360,
        image: 'ChaiLatte.jpeg',
      },
    ],
  };
  expect(reducer(previousState, clearAllProducts())).toEqual({
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  });
});

test('should add surcharge amount', () => {
  const previousState: IProductState = {
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  };
  expect(reducer(previousState, addSurchargeAmount(105))).toEqual({
    surchargeAmount: 105,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  });
});

test('should add cashout amount', () => {
  const previousState: IProductState = {
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  };
  expect(reducer(previousState, addCashoutAmount(105))).toEqual({
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 105,
    products: [],
  });
});

test('should add tip amount', () => {
  const previousState: IProductState = {
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    products: [],
  };
  expect(reducer(previousState, addTipAmount(105))).toEqual({
    surchargeAmount: 0,
    tipAmount: 105,
    cashoutAmount: 0,
    products: [],
  });
});
