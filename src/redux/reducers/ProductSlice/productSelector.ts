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
  products,
  (state: IProductState): number => state.subtotalAmount ?? 0
);

export const orderSurchargeAmountSelector = createSelector(
  products,
  (state: IProductState): number => state.surchargeAmount
);

export const orderRefundAmountSelector = createSelector(
  products,
  (state: IProductState): number => state.refundAmount ?? 0
);

export const orderOverrideSubtotalSelector = createSelector(
  products,
  (state: IProductState): boolean => state.overrideSubtotalAmount
);

export const orderTipAmountSelector = createSelector(products, (state: IProductState): number => state.tipAmount);

export const orderCashoutAmountSelector = createSelector(
  products,
  (state: IProductState): number => state.cashoutAmount
);

export const orderPromptForCashoutSelector = createSelector(
  products,
  (state: IProductState): boolean => state.promptForCashout
);

export const orderTotalSelector = createSelector(
  productSubTotalSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  orderCashoutAmountSelector,
  (subtotal, surcharge, tip, cashout): number => subtotal + surcharge + tip + cashout
);
