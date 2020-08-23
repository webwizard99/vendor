// redux imports
import { store } from '../index';
import { SET_STORE_INVENTORY } from '../actions/types';

const storeInventory = (function(){
  let inventory = [];

  const dispatchStoreInventory = function() {
    const payload = {
      type: SET_STORE_INVENTORY,
      inventory: inventory
    }
    store.dispatch(payload);
  }
  return {
    addItem: function(id) {
      if (id === null || id === undefined) {
        return false;
      }
      console.log(`storeInventory.. addItem: ${id}`)
      inventory.push(id);
    },

    getStoreInventory: function() {
      return inventory;
    },

    updateStoreInventory: function() {
      dispatchStoreInventory();
    }
  }
}());

export default storeInventory;