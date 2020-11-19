import { combineReducers } from 'redux';
import terminalsReducer from '../../features/terminals/terminalSlice';

export default combineReducers({
  terminals: terminalsReducer,
});
