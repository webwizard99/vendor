import { SET_ADVENTURERS } from '../actions/types';

const initialState = {
  adventurers: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ADVENTURERS:
      return {
        ...state,
        adventurers: action.payload
      }
    default:
      return state;
  }
}