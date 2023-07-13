import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAddProductAction, IProductState } from './interfaces';

const initialState: IProductState = {
  keypadAmount: 0,
  tipAmount: 0,
  cashoutAmount: 0,
  promptForCashout: false,
  surchargeAmount: 0,
  products: [],
  subtotalAmount: 0,
  overrideSubtotalAmount: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct(state: IProductState, action: PayloadAction<IAddProductAction>) {
      const { product } = action.payload;

      state.products.push(product);
      state.subtotalAmount += product.price;
    },
    clearAllProducts(state: IProductState) {
      state.products.splice(0, state.products.length);
      state.surchargeAmount = 0;
      state.tipAmount = 0;
      state.cashoutAmount = 0;
      state.promptForCashout = false;
      state.keypadAmount = 0;
      state.subtotalAmount = 0;
      state.overrideSubtotalAmount = false;
    },
    // Only clear products and keyPadAmount for Override Purchase
    clearProductsOnly(state: IProductState) {
      state.products.splice(0, state.products.length);
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
    addKeypadAmount(state: IProductState, action: PayloadAction<number>) {
      state.keypadAmount = action.payload;
    },
    addSubtotalAmount(state: IProductState, action: PayloadAction<number>) {
      if (action.payload !== state.subtotalAmount) {
        state.overrideSubtotalAmount = true;
        state.subtotalAmount = action.payload;
      }
    },
    togglePromptForCashout(state: IProductState) {
      state.promptForCashout = !state.promptForCashout;
    },
  },
});

export const {
  addProduct,
  clearAllProducts,
  clearProductsOnly,
  addSubtotalAmount,
  addCashoutAmount,
  addSurchargeAmount,
  addTipAmount,
  addKeypadAmount,
  togglePromptForCashout,
} = productSlice.actions;

export default productSlice.reducer;
