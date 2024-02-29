import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PayAtTableState } from './payAtTableSlice';

export const payAtTable = (state: RootState): PayAtTableState => state.payAtTable;

export const getAllTables = createSelector(payAtTable, (state) => state.tables);
