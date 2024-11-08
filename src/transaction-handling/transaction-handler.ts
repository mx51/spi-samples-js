import { RootState } from '../redux/store';
import { ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';

export abstract class TransactionHandler<TTerminal> {
  protected terminal?: TTerminal;

  abstract get terminalId(): string | undefined;
  abstract get isTerminalConnected(): boolean;
  abstract get receipt(): ITerminalReceiptFormatProps | undefined;
  abstract get txFlow(): ITxFlow | undefined;

  abstract initiatePurchase(
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    surchargeAmount: number,
    promptForCashout: boolean
  ): Promise<void>;
  abstract selectTerminal(id: string): (state: RootState) => TTerminal;

  trackTerminal(terminal: TTerminal): void {
    this.terminal = terminal;
  }
}
