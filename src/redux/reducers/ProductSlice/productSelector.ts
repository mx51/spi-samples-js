import { createSelector } from '@reduxjs/toolkit';
import { ISamplePosState } from '../../interfaces';
import { IProductSelector, IProductSelectorMap, IProductState } from './interfaces';

const products = (state: ISamplePosState) => state.products;

export const orderKeypadAmountSelector = createSelector(products, (state: IProductState): number => state.keypadAmount);

export const productsSelector = createSelector(products, (state: IProductState): Array<IProductSelector> => {
  const productMap: IProductSelectorMap = {};

  state.products.forEach((product) => {
    if (!productMap[product.id]) {
      productMap[product.id] = { quantity: 1, product };
    } else {
      productMap[product.id].quantity += 1;
    }
  });

  return Object.values(productMap);
});

export const productSubTotalSelector = createSelector(
  orderKeypadAmountSelector,
  productsSelector,
  (subtotalAmount, productSelect: Array<IProductSelector>): number => {
    if (subtotalAmount > 0) return subtotalAmount;
    const subTotal = productSelect.reduce((prev, current) => prev + current.quantity * current.product.price, 0);
    return subTotal;
  }
);

export const orderSurchargeAmountSelector = createSelector(
  products,
  (state: IProductState): number => state.surchargeAmount
);

export const orderTipAmountSelector = createSelector(products, (state: IProductState): number => state.tipAmount);

export const orderCashoutAmountSelector = createSelector(
  products,
  (state: IProductState): number => state.cashoutAmount
);

export const orderTotalSelector = createSelector(
  productSubTotalSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  orderCashoutAmountSelector,
  (subtotal, surcharge, tip, cashout): number => subtotal + surcharge + tip + cashout
);
