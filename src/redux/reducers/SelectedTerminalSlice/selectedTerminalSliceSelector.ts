import { RootState } from '../../store';

export default (state: RootState): string => state.selectedTerminal.selectedTerminalId;
