import { SET_DAY } from '../actions/types';
import days from '../Utilities/days';

const initialState = {
  day: days.getDay()
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