import { SET_STORE_NAME,
  SET_STORE_GOLD,
  SET_STORE_INVENTORY,
  SET_STORE_FILTER,
  SET_STORE_FILTER_ACTIVE } from '../actions/types';

const initialState = {
  name: '',
  gold: 0,
  filterActive: false,
  filter: 'all',
  refreshing: false,
  refreshed: false,
  inventory: [],
  inventoryCount: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STORE_NAME:
      return {
        ...state,
        name: action.name
      }
    case SET_STORE_GOLD:
      return {
        ...state,
        gold: action.amount
      }
    case SET_STORE_INVENTORY:
      const newInventory = action.inventory;
      let newCount = state.inventoryCount;
      if (Array.isArray(newInventory)) {
        newCount = newInventory.length;
      }
      return {
        ...state,
        inventory: newInventory,
        inventoryCount: newCount
      }
    case SET_STORE_FILTER_ACTIVE:
      return {
        ...state,
        filterActive: action.value
      }
    case SET_STORE_FILTER:
      return {
        ...state,
        filter: action.filter
      }
    default:
      return state;
  }
}