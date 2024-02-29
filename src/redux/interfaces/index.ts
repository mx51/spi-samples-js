import { IProductState } from '../reducers/ProductSlice/interfaces';
import { ITerminalState } from '../reducers/TerminalSlice/interfaces';

export interface ISamplePosState {
  terminals: ITerminalState;
  products: IProductState;
}
