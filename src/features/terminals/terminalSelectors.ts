import { createSelector } from '@reduxjs/toolkit';

export const selectTerminals = (state: any) => state.terminals;

export const selectActiveTerminal = createSelector(selectTerminals, (terminals) =>
  terminals.activeTerminalId ? terminals[terminals.activeTerminalId] : null
);

export const selectActiveTerminals = createSelector(selectTerminals, (terminals) =>
  Object.entries(terminals)
    .filter((e) => e[0] !== 'activeTerminalId')
    .map((e) => e[1])
);
