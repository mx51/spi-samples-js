import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export interface Payment {
  paymentType: string;
  purchaseAmount: number;
  tipAmount: number;
  surchargeAmount: number;
  terminalRefId: string;
}

interface Bill {
  payments: Payment[];
  // This is what we send to MXA to let them know the current status of the bill
  billData?: string;
}

interface Table {
  tableId: number;
  label: string;
  totalAmount: number;
  outStandingAmount: number;
  billId: string;
  bill: Bill;
  locked: boolean;
  operatorId?: string;
}

export interface PayAtTableState {
  tables: Table[];
}

const initialState: PayAtTableState = {
  tables: [],
};

const payAtTableSlice = createSlice({
  name: 'pats',
  initialState,
  reducers: {
    addNewTable(state) {
      state.tables.push({
        tableId: state.tables.length + 1,
        label: `Table #${state.tables.length + 1}`,
        totalAmount: 0,
        outStandingAmount: 0,
        billId: uuid(),
        bill: {
          payments: [],
        },
        locked: false,
      });
    },
    addPaymentToTable(state, action: PayloadAction<{ tableId: number; payment: Payment; billData: string }>) {
      const { tableId, payment, billData } = action.payload;
      const table = state.tables.find(({ tableId: id }) => id === tableId);
      if (!table) {
        throw new Error('Table not found');
      }

      table.bill.payments.push(payment);
      table.outStandingAmount -= payment.purchaseAmount;
      table.locked = table.outStandingAmount !== 0;
      table.bill.billData = billData;
    },

    toggleLocked(state, action: PayloadAction<number>) {
      const existingTable = state.tables.find(({ tableId }) => tableId === action.payload);
      if (!existingTable) {
        throw new Error('Table not found');
      }
      existingTable.locked = !existingTable.locked;
    },
    lockTable(state, action: PayloadAction<number>) {
      const existingTable = state.tables.find(({ tableId }) => tableId === action.payload);
      if (!existingTable) {
        throw new Error('Table not found');
      }
      existingTable.locked = true;
    },
    unlockTable(state, action: PayloadAction<number>) {
      const existingTable = state.tables.find(({ tableId }) => tableId === action.payload);
      if (!existingTable) {
        throw new Error('Table not found');
      }
      existingTable.locked = false;
    },
    addCostToATable(state, action: PayloadAction<{ tableId: number; cost: number }>) {
      const existingTable = state.tables.find(({ tableId }) => tableId === action.payload.tableId);
      if (!existingTable) {
        throw new Error('Table not found');
      }

      existingTable.totalAmount += action.payload.cost;
      existingTable.outStandingAmount += action.payload.cost;
    },
    closeTable(state, action: PayloadAction<number>) {
      state.tables = state.tables.filter(({ tableId }) => tableId !== action.payload);
    },
    updateOperatorId(state, action: PayloadAction<{ tableId: number; operatorId: string }>) {
      const existingTable = state.tables.find(({ tableId }) => tableId === action.payload.tableId);
      if (!existingTable) {
        throw new Error('Table not found');
      }

      existingTable.operatorId = action.payload.operatorId;
    },
  },
});

export const {
  addNewTable,
  toggleLocked,
  addCostToATable,
  lockTable,
  unlockTable,
  addPaymentToTable,
  closeTable,
  updateOperatorId,
} = payAtTableSlice.actions;
export const { reducer: payAtTableReducer } = payAtTableSlice;
