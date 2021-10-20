import { createSelector } from '@reduxjs/toolkit';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { RootState } from '../../store';
import { ITerminalProps, ITerminalState } from './interfaces';

export const terminalList = (state: RootState): ITerminalState => state.terminals;

export const terminalInstance = (instanceId: string): ((state: RootState) => ITerminalProps) =>
  createSelector(terminalList, (terminals) => terminals[instanceId]);

export const isTerminalUnpaired = (instanceId: string): ((state: RootState) => boolean) =>
  createSelector(
    terminalInstance(instanceId),
    (terminal: ITerminalProps) =>
      terminal?.status === SPI_PAIR_STATUS.PairedConnecting || terminal?.status === SPI_PAIR_STATUS.PairedConnected
  );