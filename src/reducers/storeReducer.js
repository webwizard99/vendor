import { SET_STORE_NAME,
  SET_STORE_GOLD } from '../actions/types';

const initialState = {
  name: '',
  gold: 0,
  refreshing: false,
  refreshed: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STORE_NAME:
      return {
        ...state,
        name: action.name
      }
    case SET_STORE_GOLD:
      return {
        ...state,
        gold: action.amount
      }
    default:
      return state;
  }
}