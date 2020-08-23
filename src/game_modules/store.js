// redux imports
import { store } from '../index';
import { SET_STORE_GOLD } from '../actions/types';

const store = (function(){
  let name = '';

  const startingGold = 1000;
  let gold = startingGold;

  const dispatchStoreGold = function() {
    const payload = {
      type: SET_STORE_GOLD,
      amount: gold
    }
    store.dispatch(payload);
  }
  
  return {
    chargeGold: function(amount) {
      if (gold < amount) {
        console.log('attempted to charge more gold than vendor owns')
        return false;
      }
      gold -= amount;
    },
    getName: function() {
      return name;
    },

    setName: function(newName) {
      name = newName;
    },

    getStartingGold: function() {
      return startingGold;
    },

    getGold: function() {
      return gold;
    },

    setGold: function(newGold) {
      gold = newGold;
    },
    updateGold: function() {
      dispatchStoreGold();
    }
  }
}());

export default store;