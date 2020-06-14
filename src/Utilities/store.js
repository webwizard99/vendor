const store = (function(){
  let name = '';

  const startingGold = 1000;
  let gold = startingGold;
  
  return {
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
    }
  }
}());

export default store;