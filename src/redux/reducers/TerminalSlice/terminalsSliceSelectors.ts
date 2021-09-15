import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ITerminalState } from './interfaces';

export const terminalList = (state: RootState): ITerminalState => state.terminals;

export const terminalInstance = (instanceId: string): Any =>
  createSelector(terminalList, (terminals) => terminals[instanceId]);
