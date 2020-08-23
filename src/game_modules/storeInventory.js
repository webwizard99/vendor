import Items from './items';


const storeInventory = (function(){
  let inventory = [];

  return {
    addItem: function(id) {
      if (id === null || id === undefined) {
        return false;
      }
      inventory.push(id);
    },

    getStoreInventory: function() {
      return inventory;
    }
  }
}());

export default storeInventory;