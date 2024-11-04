import { RootState } from '../../store';
import { ISelectedTerminalState } from './interface';

export default (state: RootState): ISelectedTerminalState => state.selectedTerminal;
