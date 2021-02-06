import { SET_DUNGEON_LEVELS, SET_DUNGEON_LEVEL_EXPLORED } from '../actions/types';

const initialState = {
  levels: null,
  exploredLevel: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DUNGEON_LEVELS:
      return {
        ...state,
        levels: action.payload
      }
    case SET_DUNGEON_LEVEL_EXPLORED:
      return {
        ...state,
        exploredLevel: action.level
      }
    default:
      return state;
  }
}