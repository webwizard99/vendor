import { SET_DAY } from '../actions/types';

const initialState = {
  day: 1
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day
      }
    default:
      return state;
  }
}