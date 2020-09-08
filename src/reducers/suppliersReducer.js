import { SET_SUPPLIERS, SET_SUPPLIERS_INITIALIZED } from '../actions/types';

const initialState = {
  suppliers: null,
  count: 0,
  initialized: false
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
      case SET_SUPPLIERS_INITIALIZED:
        return {
          ...state,
          initialized: action.value
        }
    default:
      return state;
  }
}