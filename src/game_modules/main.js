import days from './days';
import gameStore from './store';
import storeInventory from './storeInventory';
import suppliers from './suppliers';
import supplies from './supplies';

// redux imports


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
      gameStore.setName(payload.name);

      const startingGold = gameStore.getStartingGold();
      gameStore.setGold(startingGold);

      createTestPotions();

      supplies.fillSupplies(currentMaxLevel);
      console.log(supplies.getSupplies());
      suppliers.initializeSuppliers(maxSuppliers);

    }

  }
} ());

export default main;