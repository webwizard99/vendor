import { combineReducers } from 'redux';
import daysReducer from './daysReducer';
import gameStateReducer from './gameStateReducer'
import storeReducer from './storeReducer';

export default combineReducers({
  days: daysReducer,
  gameState: gameStateReducer,
  storeState: storeReducer
});