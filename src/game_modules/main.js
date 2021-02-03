// constants
import gameConstants from './gameConstants';

// game module imports
import days from './days';
import suppliers from './suppliers';
import supplies from './supplies';
import adventurers from './adventurers';
import gameStore from './store';

// redux imports
import { store } from '../index';
import { SET_DETAIL_UPDATE } from '../actions/types';


const main = (function() {
  
  let currentMaxLevel = 1;

  const dispatchUpdate = function() {
    const payload = {
      type: SET_DETAIL_UPDATE,
      value: true
    }
    store.dispatch(payload);
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

      supplies.setSupplyLevel(currentMaxLevel);
      supplies.fillSupplyPool();
      suppliers.initializeSuppliers(gameConstants.maxSuppliers);

      adventurers.initializeAdventurers(gameConstants.startingAdventurers);
    },

    getGameLevel: function() {
      return currentMaxLevel;
    },

    performTurn: function() {
      adventurers.takeAdventurerTurn();
      // need logic for triggering supply pool fetch if
      // max level has changed
      supplies.fillSupplies();
      suppliers.takeSupplierIncomeTurns();
      suppliers.takeSupplierTurn();
      dispatchUpdate();
    }

  }
} ());

export default main;