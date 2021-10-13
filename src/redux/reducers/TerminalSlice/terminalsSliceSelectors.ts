import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ITerminalProps, ITerminalState } from './interfaces';

export const terminalList = (state: RootState): ITerminalState => state.terminals;

export const terminalInstance = (instanceId: string): ((state: RootState) => ITerminalProps) =>
  createSelector(terminalList, (terminals) => terminals[instanceId]);
