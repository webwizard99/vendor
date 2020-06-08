import { combineReducers } from 'redux';
import daysReducer from './daysReducer';

export default combineReducers({
  days: daysReducer
});