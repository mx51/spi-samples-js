import { createSelector } from '@reduxjs/toolkit';
import { SPI_PAIR_STATUS, SPI_TRANSACTION_TYPES } from '../../../definitions/constants/commonConfigs';
import {
  PATH_CASH_OUT,
  PATH_PURCHASE,
  PATH_REFUND,
  PATH_ACCOUNT_VERIFY,
  PATH_PRE_AUTH,
  TEXT_CASHOUT,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_ACCOUNT_VERIFY,
  TEXT_PRE_AUTH,
} from '../../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../../definitions/constants/terminalConfigs';
import { RootState } from '../../store';
import { IPairingFlow, ITerminalProps, ITerminalReceiptFormatProps, ITerminalState, ITxMessage } from './interfaces';

export const terminalList = (state: RootState): ITerminalState => state.terminals;

export const terminalInstance = (instanceId: string): ((state: RootState) => ITerminalProps) =>
  createSelector(terminalList, (terminals) => terminals[instanceId]);

export const pairedConnectedTerminalList = createSelector(terminalList, (terminals: ITerminalState) =>
  Object.values(terminals).filter((terminal: ITerminalProps) => terminal.status === SPI_PAIR_STATUS.PairedConnected)
);

export const isPaired = createSelector(
  pairedConnectedTerminalList,
  (terminals: Array<ITerminalProps>) => terminals.length > 0
);

export const terminalPairingFlow = (instanceId: string): ((state: RootState) => IPairingFlow | null) =>
  createSelector(terminalInstance(instanceId), (terminal) => terminal?.pairingFlow);

export const isTerminalUnpaired = (instanceId: string): ((state: RootState) => boolean) =>
  createSelector(
    terminalInstance(instanceId),
    (terminal: ITerminalProps) =>
      terminal?.status === SPI_PAIR_STATUS.PairedConnecting || terminal?.status === SPI_PAIR_STATUS.PairedConnected
  );

export const terminalPosRefId = (instanceId: string): ((state: RootState) => string | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.txFlow?.request?.data?.posRefId);

export const terminalTransactionTypeObject = (
  instanceId: string
): ((state: RootState) => { typePath: string; typeTitle: string }) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => {
    switch (terminal?.txFlow?.type) {
      case SPI_TRANSACTION_TYPES.CashoutOnly:
        return {
          typePath: PATH_CASH_OUT,
          typeTitle: TEXT_CASHOUT,
        };
      case SPI_TRANSACTION_TYPES.Refund:
        return {
          typePath: PATH_REFUND,
          typeTitle: TEXT_REFUND,
        };
      case SPI_TRANSACTION_TYPES.Preauth:
        return {
          typePath: PATH_PRE_AUTH,
          typeTitle: TEXT_PRE_AUTH,
        };
      case SPI_TRANSACTION_TYPES.AccountVerify:
        return {
          typePath: PATH_ACCOUNT_VERIFY,
          typeTitle: TEXT_ACCOUNT_VERIFY,
        };
      default:
        return {
          typePath: PATH_PURCHASE,
          typeTitle: TEXT_PURCHASE,
        };
    }
  });

export const terminalTxFlowReceiptContent = (instanceId: string): ((state: RootState) => string | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.receipt?.merchantReceipt);

export const terminalTxFlowReceipt = (
  instanceId: string
): ((state: RootState) => ITerminalReceiptFormatProps | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.receipt);

export const terminalTxAmount = (instanceId: string): ((state: RootState) => number | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.txFlow?.amountCents);

export const terminalTxFlowSuccessTracker = (instanceId: string): ((state: RootState) => string | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.txFlow?.success);

export const isTerminalTxFlowSuccess = (instanceId: string): ((state: RootState) => boolean) =>
  createSelector(
    terminalInstance(instanceId),
    (terminal: ITerminalProps) => terminal?.txFlow?.success === TxFlowState.Success
  );

export const terminalTxFlowFinishedTracker = (instanceId: string): ((state: RootState) => boolean | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.txFlow?.finished);

export const terminalTxFlowAwaitingSignatureTracker = (
  instanceId: string
): ((state: RootState) => boolean | undefined) =>
  createSelector(terminalInstance(instanceId), (terminal: ITerminalProps) => terminal?.txFlow?.awaitingSignatureCheck);

export const terminalTxTotalAmount = (instanceId: string): ((state: RootState) => number) =>
  createSelector(
    terminalInstance(instanceId),
    (terminal: ITerminalProps) =>
      (terminal?.txFlow?.response?.data?.purchaseAmount as number) +
      (terminal?.txFlow?.response?.data?.surchargeAmount as number) +
      ((terminal?.txFlow?.response?.data?.bankCashAmount as number) || 0) +
      ((terminal?.txFlow?.response?.data?.tipAmount as number) || 0)
  );

export const terminalTxMessage = (instanceId: string): ((state: RootState) => ITxMessage | null) =>
  createSelector(terminalInstance(instanceId), (terminal) => terminal?.txMessage);
