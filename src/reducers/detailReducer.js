import { SET_DETAIL_ID } from '../actions/types';

const initialState = {
  id: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DETAIL_ID:
      return {
        ...state,
        id: action.id
      }
    default:
      return state;
  }
}