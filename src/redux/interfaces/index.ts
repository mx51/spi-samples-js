import { IPairState } from '../reducers/pairSlice';
import { IProductState } from '../reducers/ProductSlice/interfaces';
import { ITerminalState } from '../reducers/TerminalSlice/interfaces';

export interface ISamplePosState {
  pair: IPairState;
  terminals: ITerminalState;
  products: IProductState;
}
