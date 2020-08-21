import days from './days';
import store from './store';
import storeInventory from './storeInventory';
import suppliers from './suppliers';
import supplies from './supplies';

const main = (function() {
  
  const testPotionCount = 5;
  const maxSuppliers = 3;
  let currentMaxLevel = 1;

  const createTestPotions = function() {
    for (let x = 0; x < testPotionCount; x++) {
      storeInventory.addTestPotion();
    }
    
  }

  return {
    init: function(payload) {
      // set day to 1
      days.setDay(1);
      
      // set store name
      if (!payload.name) {
        console.log('Game must be started with a payload object that contains a store name!');
      }
      store.setName(payload.name);

      const startingGold = store.getStartingGold();
      store.setGold(startingGold);

      createTestPotions();

      suppliers.initializeSuppliers(maxSuppliers);
      console.log(suppliers.getSuppliers());

      supplies.fillSupplies(currentMaxLevel);
      
    }

  }
} ());

export default main;