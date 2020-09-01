import { SET_PROFILE_ACTIVE } from '../actions/types';

const initialState = {
  active: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE_ACTIVE:
      return {
        ...state,
        active: action.value
      }
    default:
      return state;
  }
}