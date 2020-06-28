import Items from './items';
import gameStore from './store';


const storeInventory = (function(){
  let inventory = [];

  let currentIdIndex = 0;

  const addItem = function(newItem) {
    newItem.id = currentIdIndex;
    currentIdIndex++;
    inventory.push(newItem);
  }

  
  return {
    addPotion: function(name, value, payload) {
      const itemTypes = Items.getItemTypes();
      const newPotion = Items.createItem(itemTypes.potion, name, value, payload);
      addItem(newPotion);
    },

    addTestPotion: function() {
      const testPotion = Items.createTestPotion();
      addItem(testPotion);
    },

    getStoreInventory: function() {
      return inventory;
    }
  }
}());

export default storeInventory;