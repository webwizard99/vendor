import { SET_MOBILE_SCREEN, SET_MOBILE_DROPDOWN } from '../actions/types';

const intitialState = {
  screen: 'store',
  dropDown: false
}

export default function(state = intitialState, action) {
  switch(action.type) {
    case SET_MOBILE_SCREEN:
      return {
        ...state,
        screen: action.screen
      }
    case SET_MOBILE_DROPDOWN:
      return {
        ...state,
        screen: action.value
      }
    default:
      return state;
  }
}