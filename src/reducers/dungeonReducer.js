import { SET_DUNGEON_LEVELS } from '../actions/types';

const initialState = {
  levels: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DUNGEON_LEVELS:
      return {
        ...state,
        levels: action.payload
      }
    default:
      return state;
  }
}