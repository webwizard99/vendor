import { SET_SUPPLY_READY } from '../actions/types';

const initialState = {
  ready: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLY_READY:
      return {
        ...state,
        ready: action.value
      }
    default:
      return state;
  }
}