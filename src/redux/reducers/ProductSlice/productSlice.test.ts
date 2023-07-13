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
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    products: [],
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
  };
  const action = { product: { id: 1, name: 'Latte', price: 360, image: 'Latte.jpeg' } };
  expect(reducer(previousState, addProduct(action))).toEqual({
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    subtotalAmount: 360,
    overrideSubtotalAmount: false,
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
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
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
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
    products: [],
  });
});

test('should add surcharge amount', () => {
  const previousState: IProductState = {
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    products: [],
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
  };
  expect(reducer(previousState, addSurchargeAmount(105))).toEqual({
    keypadAmount: 0,
    surchargeAmount: 105,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
    products: [],
  });
});

test('should add cashout amount', () => {
  const previousState: IProductState = {
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    products: [],
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
  };
  expect(reducer(previousState, addCashoutAmount(105))).toEqual({
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 105,
    promptForCashout: false,
    subtotalAmount: 0,
    overrideSubtotalAmount: false,
    products: [],
  });
});

test('should add tip amount', () => {
  const previousState: IProductState = {
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 0,
    cashoutAmount: 0,
    promptForCashout: false,
    products: [],
    overrideSubtotalAmount: false,
    subtotalAmount: 0,
  };
  expect(reducer(previousState, addTipAmount(105))).toEqual({
    keypadAmount: 0,
    surchargeAmount: 0,
    tipAmount: 105,
    cashoutAmount: 0,
    promptForCashout: false,
    overrideSubtotalAmount: false,
    subtotalAmount: 0,
    products: [],
  });
});
