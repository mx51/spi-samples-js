import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAddProductAction, IProductState } from './interfaces';

const initialState: IProductState = {
  tipAmount: 0,
  cashoutAmount: 0,
  surchargeAmount: 0,
  products: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct(state: IProductState, action: PayloadAction<IAddProductAction>) {
      const { product } = action.payload;

      state.products.push(product);
    },
    clearAllProducts(state: IProductState) {
      state.products.splice(0, state.products.length);
      state.surchargeAmount = 0;
      state.tipAmount = 0;
      state.cashoutAmount = 0;
    },
    addSurchargeAmount(state: IProductState, action: PayloadAction<number>) {
      state.surchargeAmount = action.payload;
    },
    addTipAmount(state: IProductState, action: PayloadAction<number>) {
      state.tipAmount = action.payload;
    },
    addCashoutAmount(state: IProductState, action: PayloadAction<number>) {
      state.cashoutAmount = action.payload;
    },
  },
});

export const { addProduct, clearAllProducts, addCashoutAmount, addSurchargeAmount, addTipAmount } =
  productSlice.actions;

export default productSlice.reducer;
