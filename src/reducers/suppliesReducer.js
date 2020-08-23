import { SET_SUPPLY_READY, SET_SUPPLY_SPAWNED } from '../actions/types';

const initialState = {
  ready: false,
  spawned: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLY_READY:
      return {
        ...state,
        ready: action.value
      }
    case SET_SUPPLY_SPAWNED:
      return {
        ...state,
        spawned: action.value
      }
    default:
      return state;
  }
}