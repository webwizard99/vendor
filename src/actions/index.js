import axios from 'axios';
import { FETCH_USER, SET_STORE_GOLD, SET_DAY, SET_SUPPLIERS, SET_STORE_NAME } from './types';

// game imports
import gameStore from '../game_modules/store';
import days from '../game_modules/days';
import suppliers from '../game_modules/suppliers';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
  if (res.data && res.data.import_nickname) {
    dispatch({ type: SET_STORE_NAME, name: res.data.nickname});
  }
};

export const fetchGold = () => async dispatch => {
  const gold = await gameStore.getGold();
  dispatch({ type: SET_STORE_GOLD, amount: gold });
}

export const fetchDay = () => async dispatch => {
  const day = await days.getDay();
  dispatch({ type: SET_DAY, day: day });
}

export const fetchSuppliers = () => async dispatch => {
  const newSuppliers = await suppliers.getSuppliers();
  dispatch({ type: SET_SUPPLIERS, payload: newSuppliers });
}