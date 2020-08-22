import { SET_SUPPLIERS } from '../actions/types';

const initialState = {
  suppliers: null,
  count: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLIERS:
      let number = 0;
      if (Array.isArray(action.payload)) {
        number = action.payload.length;
      }    
      return {
          ...state,
          suppliers: action.payload,
          count: number
        }
    default:
      return state;
  }
}