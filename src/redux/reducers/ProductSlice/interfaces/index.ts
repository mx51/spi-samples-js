export interface IProductState {
  keypadAmount: number;
  surchargeAmount: number;
  tipAmount: number;
  cashoutAmount: number;
  promptForCashout: boolean;
  products: Array<IProduct>;
  subtotalAmount: number;
  overrideSubtotalAmount: boolean;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface IAddProductAction {
  product: IProduct;
}

export interface IProductSelector {
  quantity: number;
  product: IProduct;
}

export type IProductSelectorMap = { [key: number]: IProductSelector };
