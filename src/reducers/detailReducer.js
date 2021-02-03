import { SET_DETAIL_ID, SET_DETAIL_UPDATE } from '../actions/types';

const initialState = {
  id: null,
  update: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DETAIL_ID:
      return {
        ...state,
        id: action.id
      }
    case SET_DETAIL_UPDATE: {
      return {
        ...state,
        update: action.value
      }
    }
    default:
      return state;
  }
}