import days from './days';
import gameStore from './store';
import storeInventory from './storeInventory';
import suppliers from './suppliers';
import supplies from './supplies';

// redux imports


const main = (function() {
  
  const maxSuppliers = 3;
  let currentMaxLevel = 1;

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

      supplies.setSupplyLevel(currentMaxLevel);
      supplies.fillSupplyPool();
      suppliers.initializeSuppliers(maxSuppliers);

    },

    getGameLevel: function() {
      return currentMaxLevel;
    }

  }
} ());

export default main;