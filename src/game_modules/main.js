// constants
import gameConstants from './gameConstants';

// game module imports
import days from './days';
import suppliers from './suppliers';
import supplies from './supplies';
import adventurers from './adventurers';

// redux imports
import gameStore from './store';

const main = (function() {
  
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
      suppliers.initializeSuppliers(gameConstants.maxSuppliers);

      adventurers.initializeAdventurers(gameConstants.startingAdventurers);
    },

    getGameLevel: function() {
      return currentMaxLevel;
    }

  }
} ());

export default main;