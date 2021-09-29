export interface IProductState {
  surchargeAmount: number;
  tipAmount: number;
  cashoutAmount: number;
  products: Array<IProduct>;
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
