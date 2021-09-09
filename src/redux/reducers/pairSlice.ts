import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// constants
import { SPI_PAIR_FLOW } from '../../definitions/constants/commonConfigs';

export interface IPairState {
  status: string;
}

const initialState: IPairState = {
  status: SPI_PAIR_FLOW.IDLE,
};

export const pairSlice = createSlice({
  name: 'pairSlice',
  initialState,
  reducers: {
    setPairStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
});

export const { setPairStatus } = pairSlice.actions;

export default pairSlice.reducer;
