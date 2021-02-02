import { SET_ADVENTURERS, SET_ADVENTURER_UPDATE } from '../actions/types';

const initialState = {
  adventurers: null,
  update: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ADVENTURERS:
      return {
        ...state,
        adventurers: action.payload
      }
    case SET_ADVENTURER_UPDATE:
      let newUpdate = state.update + 1;
      if (newUpdate > 10) {
        newUpdate = 0;
      }
      console.log(newUpdate);
      return {
        ...state,
        update: newUpdate
      }
    default:
      return state;
  }
}