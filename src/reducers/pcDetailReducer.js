import { SET_PC_DETAIL, SET_PC_DROPDOWN } from '../actions/types';
import pcMenus from '../Utilities/pcMenus';

const initialState = {
  detail: pcMenus.adventurers,
  dropdown: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PC_DETAIL:
      return {
        ...state,
        detail: action.detail
      }
    case SET_PC_DROPDOWN:
      return {
        ...state,
        dropdown: action.value
      }
    default:
      return state;
  }
}