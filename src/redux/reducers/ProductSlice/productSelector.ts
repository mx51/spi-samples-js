import { createSelector } from '@reduxjs/toolkit';
import { ISamplePosState } from '../../interfaces';
import { IProductSelector, IProductSelectorMap, IProductState } from './interfaces';

const products = (state: ISamplePosState) => state.products;

export const productsSelector = createSelector(products, (state: IProductState): Array<IProductSelector> => {
  const productMap: IProductSelectorMap = {};

  state.forEach((product) => {
    if (!productMap[product.id]) {
      productMap[product.id] = { quantity: 1, product };
    } else {
      productMap[product.id].quantity += 1;
    }
  });

  return Object.values(productMap);
});

export const productSubTotalSelector = createSelector(
  productsSelector,
  (productSelect: Array<IProductSelector>): number => {
    const subTotal = productSelect.reduce((prev, current) => prev + current.quantity * current.product.price, 0);
    return subTotal;
  }
);
