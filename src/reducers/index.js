import { combineReducers } from 'redux';
import daysReducer from './daysReducer';
import gameStateReducer from './gameStateReducer'
import storeReducer from './storeReducer';
import authReducer from './authReducer';
import suppliersReducer from './suppliersReducer';
import suppliesReducer from './suppliesReducer';
import profileReducer from './profileReducer';
import appStateReducer from './appStateReducer';

export default combineReducers({
  auth: authReducer,
  days: daysReducer,
  gameState: gameStateReducer,
  storeState: storeReducer,
  suppliers: suppliersReducer,
  supplies: suppliesReducer,
  profile: profileReducer,
  app: appStateReducer
});