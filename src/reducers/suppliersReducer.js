import { SET_SUPPLIERS } from '../actions/types';

const initialState = {
  suppliers: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload
      }
    default:
      return state;
  }
}