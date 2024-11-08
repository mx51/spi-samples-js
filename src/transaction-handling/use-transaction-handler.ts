import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { createTransactionHandler } from './transaction-handling';
import { TransactionHandler } from './transaction-handler';
import { ISelectedTerminalState } from '../redux/reducers/SelectedTerminalSlice/interface';

// TODO: This is a total mess but you get the idea
//  In master we create a new transaction handler on every component render cycle
//  If we want to maintain any state on the transaction handler we need to wrap creating in a useEffect
export function useTransactionHandler(
  selectedTerminalState: ISelectedTerminalState
): TransactionHandler<unknown> | undefined {
  const { id, connection } = selectedTerminalState;
  const [transactionHandler, setTransactionHandler] = useState<TransactionHandler<unknown> | undefined>();

  useEffect(() => {
    const createdTransactionHandler = createTransactionHandler(connection);

    setTransactionHandler(createdTransactionHandler);
  }, [selectedTerminalState.id]);

  const selectedTerminal = useSelector(transactionHandler?.selectTerminal(id) ?? createSelector(() => {}));

  transactionHandler?.trackTerminal(selectedTerminal);

  return transactionHandler;
}
