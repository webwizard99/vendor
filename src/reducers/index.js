import { combineReducers } from 'redux';
import daysReducer from './daysReducer';
import gameStateReducer from './gameStateReducer'
import storeReducer from './storeReducer';
import authReducer from './authReducer';
import suppliersReducer from './suppliersReducer';
import suppliesReducer from './suppliesReducer';

export default combineReducers({
  auth: authReducer,
  days: daysReducer,
  gameState: gameStateReducer,
  storeState: storeReducer,
  suppliers: suppliersReducer,
  supplies: suppliesReducer
});