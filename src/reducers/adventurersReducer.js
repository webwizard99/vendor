import { SET_ADVENTURERS, SET_PARTIAL_ADVENTURERS } from '../actions/types';

const initialState = {
  adventurers: null,
  partialAdventurers: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ADVENTURERS:
      return {
        ...state,
        adventurers: action.payload
      }
    case SET_PARTIAL_ADVENTURERS:
      return {
        ...state,
        partialAdventurers: action.payload
      }
    default:
      return state;
  }
}