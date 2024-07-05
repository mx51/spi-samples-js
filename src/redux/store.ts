import { AnyAction, Reducer, combineReducers, configureStore } from '@reduxjs/toolkit';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import commonReducer from './reducers/CommonSlice/commonSlice';
import pairFormReducer from './reducers/PairFormSlice/pairFormSlice';
import { preAuthReducer } from './reducers/PreAuth/preAuthSlice';
import productSlice from './reducers/ProductSlice/productSlice';
import selectedTerminalReducer from './reducers/SelectedTerminalSlice/selectedTerminalSlice';
import terminalReducer from './reducers/TerminalSlice/terminalsSlice';
import { IPreAuthState } from './reducers/PreAuth/interfaces';
import { PayAtTableState, payAtTableReducer } from './reducers/PayAtTableSlice/payAtTableSlice';
import { ITerminalState } from './reducers/TerminalSlice/interfaces';

const terminalReducerMigration: Any = {
  0: (state: ITerminalState) => {
    Object.keys(state).forEach((key) => {
      if (state[key] && state[key].deviceAddress) {
        state[key].deviceAddress = state[key].deviceAddress.replace(/^wss?:\/\//, '');
      }
      if (state[key] && state[key].secrets) {
        state[key].secrets = {
          encKey: (state[key].secrets as Any).EncKey,
          hmacKey: (state[key].secrets as Any).HmacKey,
        };
      }
    });
    return state;
  },
};

const rootReducer = combineReducers({
  common: commonReducer,
  pairForm: pairFormReducer,
  products: productSlice,
  terminals: persistReducer<ITerminalState, AnyAction>(
    {
      key: 'terminals',
      version: 0,
      storage,
      stateReconciler: hardSet,
      migrate: createMigrate(terminalReducerMigration, { debug: false }),
    },
    terminalReducer
  ) as unknown as Reducer<ITerminalState>,
  selectedTerminal: selectedTerminalReducer,
  preAuth: persistReducer<IPreAuthState, AnyAction>(
    {
      key: 'root',
      storage,
      stateReconciler: hardSet,
    },
    preAuthReducer
  ) as unknown as Reducer<IPreAuthState>,
  payAtTable: persistReducer<PayAtTableState, AnyAction>(
    {
      key: 'payAtTable',
      storage,
      stateReconciler: hardSet,
    },
    payAtTableReducer
  ) as unknown as Reducer<PayAtTableState>,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
