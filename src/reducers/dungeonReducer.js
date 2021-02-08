import { SET_DUNGEON_LEVELS, 
  SET_DUNGEON_LEVEL_EXPLORED,
  SET_DUNGEON_ADVENTURERS
} from '../actions/types';

const initialState = {
  levels: null,
  exploredLevel: 0,
  adventurers: null
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
    case SET_DUNGEON_ADVENTURERS:
      return {
        ...state,
        adventurers: action.adventurers
      }
    default:
      return state;
  }
}