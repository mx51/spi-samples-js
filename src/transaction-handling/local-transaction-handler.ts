import { SpiStatus } from '@mx51/spi-client-js';
import { TransactionHandler } from './transaction-handler';
import { ITerminalProps, ITerminalReceiptFormatProps, ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { messageEvents } from '../definitions/constants/commonConfigs';
import spiService from '../services/spiService';

export class LocalTransactionHandler extends TransactionHandler<ITerminalProps> {
  get terminalId(): string | undefined {
    return this.terminal?.serialNumber;
  }

  get isTerminalConnected(): boolean {
    return this.terminal?.status === SpiStatus.PairedConnected;
  }

  get receipt(): ITerminalReceiptFormatProps | undefined {
    return this.terminal?.receipt;
  }

  get txFlow(): ITxFlow | undefined {
    // Doing this for now because the type on terminal is ItxFlow | null
    if (this.terminal?.txFlow) {
      return this.terminal.txFlow;
    }

    return undefined;
  }

  async initiatePurchase(
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    surchargeAmount: number,
    promptForCashout: boolean
  ): Promise<void> {
    const posRefId = `${messageEvents.purchase}-${new Date().toISOString()}`;
    spiService.initiatePurchaseTransaction(
      this.terminalId!,
      posRefId,
      purchaseAmount,
      tipAmount,
      cashoutAmount,
      promptForCashout,
      surchargeAmount
    );
  }

  selectTerminal = (id: string) => terminalInstance(id);
}
