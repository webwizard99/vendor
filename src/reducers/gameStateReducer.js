import { SET_GAME_STATE,
  SET_UPDATES,
  SET_STORE_UPDATE}
   from '../actions/types';

const initialState = {
  started: false,
  storeUpdate: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_GAME_STATE:
      return {
        ...state,
        started: action.value
      }
    case SET_UPDATES:
      const updates = action.payload;
      const { storeUpdate } = updates;
      return {
        ...state,
        storeUpdate: storeUpdate
      }
    case SET_STORE_UPDATE:
      return {
        ...state,
        storeUpdate: action.value
      }
    default:
      return state;
  }
}