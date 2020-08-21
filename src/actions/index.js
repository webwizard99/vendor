import axios from 'axios';
import { FETCH_USER, SET_STORE_GOLD } from './types';

// game imports
import gameStore from '../game_modules/store';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchGold = () => async dispatch => {
  const gold = await gameStore.getGold();
  dispatch({ type: SET_STORE_GOLD, amount: gold });
}