import { IProduct } from '../../interfaces';

export type ProductProps = {
  product: IProduct;
  onClick: React.MouseEventHandler<HTMLElement>;
};
