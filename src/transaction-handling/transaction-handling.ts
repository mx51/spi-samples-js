import { CloudTransactionHandler } from './cloud-transaction-handler';
import { LocalTransactionHandler } from './local-transaction-handler';
import { TransactionHandler } from './transaction-handler';
import { PlaceholderTransactionHandler } from './placeholder-transaction-handler';
import { TerminalConnection } from './terminal-connection';

export function createTransactionHandler(terminalConnection: TerminalConnection): TransactionHandler<unknown> {
  switch (terminalConnection) {
    case 'cloud':
      return new CloudTransactionHandler();
    case 'local':
      return new LocalTransactionHandler();
    default:
      return new PlaceholderTransactionHandler();
  }
}
