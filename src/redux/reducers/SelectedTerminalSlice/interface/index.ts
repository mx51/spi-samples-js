import { TerminalConnection } from '../../../../transaction-handling/terminal-connection';

export interface ISelectedTerminalState {
  id: string;
  connection: TerminalConnection;
}
