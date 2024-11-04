import { TransactionHandler } from './transaction-handler';
import { ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';

/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove this
export class PlaceholderTransactionHandler extends TransactionHandler<undefined> {
  get terminalId(): string | undefined {
    return undefined;
  }

  get isTerminalConnected(): boolean {
    return false;
  }

  get receipt(): ITerminalReceiptFormatProps | undefined {
    return undefined;
  }

  get txFlow(): ITxFlow | undefined {
    return undefined;
  }

  selectTerminal = (id: string) => () => undefined;

  async initiatePurchase(
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    surchargeAmount: number,
    promptForCashout: boolean
  ): Promise<void> {
    // TODO: Better to throw here instead?
    // Nothing to do
  }
}
