import { SET_STORE_NAME,
  SET_STORE_GOLD,
  SET_STORE_INVENTORY,
  SET_STORE_FILTER,
  SET_STORE_FILTER_ACTIVE,
  SET_STORE_UPDATE_STATUS,
  SET_STORE_MOBILE_DETAIL,
  SET_STORE_MOBILE_DETAIL_ITEM } from '../actions/types';

const initialState = {
  name: '',
  gold: 0,
  filterActive: false,
  filter: 'all',
  needsUpdate: false,
  inventory: [],
  inventoryCount: 0,
  mobileDetail: null,
  mobileItemDetail: null
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
    case SET_STORE_UPDATE_STATUS:
      const newStatus = !state.needsUpdate;
      return {
        ...state,
        needsUpdate: newStatus
      }
    case SET_STORE_MOBILE_DETAIL:
      return {
        ...state,
        mobileDetail: action.detail
      }
    case SET_STORE_MOBILE_DETAIL_ITEM:
      return {
        ...state,
        mobileItemDetail: action.itemDetail
      }
    default:
      return state;
  }
}