import { SET_IS_FULLSCREEN, SET_IS_PC, SET_IS_MOBILE } from '../actions/types';

const initialState = {
  isFullscreen: false,
  isPc: true,
  isMobile: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_IS_FULLSCREEN:
      return {
        ...state,
        isFullscreen: action.value
      }
    case SET_IS_PC:
      return {
        ...state,
        isPc: action.value
      }
    case SET_IS_MOBILE:
      return {
        ...state,
        isMobile: action.value
      }
    default:
      return state;
  }
}