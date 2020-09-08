import { SET_MOBILE_SCREEN } from '../actions/types';

const intitialState = {
  screen: 'store'
}

export default function(state = intitialState, action) {
  switch(action.type) {
    case SET_MOBILE_SCREEN:
      return {
        ...state,
        screen: action.screen
      }
    default:
      return state;
  }
}