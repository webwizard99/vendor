// redux imports
import { store } from '../index';
import { SET_STORE_INVENTORY } from '../actions/types';

// game module imports
import gameItems from './items';

const storeInventory = (function(){
  let inventory = [];

  const dispatchStoreInventory = function() {
    const payload = {
      type: SET_STORE_INVENTORY,
      inventory: inventory
    }
    store.dispatch(payload);
  }

  const composeInventory = function() {
    let composedInventory = [];
      inventory.forEach(item => {
        let thisItem = gameItems.getItem(item.itemId);
        composedInventory.push({ ...thisItem, markup: item.markup });
      });
      return composedInventory;
  }

  const filterInventory = function(filter) {
    let filteredInventory = composeInventory().filter(item => item.type === filter);
    return filteredInventory;
  }

  return {
    addItem: function(id) {
      if (id === null || id === undefined) {
        return false;
      }
      const newStoreItem = { itemId: id,
        markup: 150
      }
      inventory.push(newStoreItem);
    },

    getStoreInventory: function() {
      return inventory;
    },

    updateStoreInventory: function() {
      dispatchStoreInventory();
    },

    getComposedInventory: function() {
      return composeInventory();
    },

    getFilteredInventory: function(newFilter) {
      if (!newFilter || newFilter.toLowerCase() === 'all') {
        return composeInventory();
      }
      else {
        return filterInventory(newFilter);
      }
    }
  }
}());

export default storeInventory;