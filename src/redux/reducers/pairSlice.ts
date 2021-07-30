import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// constants
import { TEXT_STATUS_UNPAIRED } from '../../definitions/constants/commonConfigs';

interface IPairState {
  status: string;
}

const initialState: IPairState = {
  status: TEXT_STATUS_UNPAIRED,
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
