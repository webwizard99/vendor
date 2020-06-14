import days from './days';
import store from './store';

const main = (function() {
  

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
    }

  }
} ());

export default main;