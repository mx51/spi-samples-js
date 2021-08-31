import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAddProductAction, IProductState } from './interfaces';

const initialState: IProductState = [];

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct(state: IProductState, action: PayloadAction<IAddProductAction>) {
      const { product } = action.payload;

      state.push(product);
    },
    clearAllProducts(state: IProductState) {
      state.splice(0, state.length);
    },
  },
});

export const { addProduct, clearAllProducts } = productSlice.actions;

export default productSlice.reducer;
