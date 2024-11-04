import { useSelector } from 'react-redux';

import { createTransactionHandler } from './transaction-handling';
import { TransactionHandler } from './transaction-handler';
import { ISelectedTerminalState } from '../redux/reducers/SelectedTerminalSlice/interface';

export function useTransactionHandler(selectedTerminalState: ISelectedTerminalState): TransactionHandler<unknown> {
  const { id, connection } = selectedTerminalState;
  const transactionHandler = createTransactionHandler(connection);
  const selectedTerminal = useSelector(transactionHandler.selectTerminal(id));

  transactionHandler.trackTerminal(selectedTerminal);

  return transactionHandler;
}
