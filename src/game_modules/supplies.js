import ItemTypes from '../Utilities/itemTypes';

const supplies = (function(){
  let supplies = [];

  const dailySupplies = 10;

  const fetchItemArrForSupply = async function(lvl) {
    if (!lvl) return;

    // produce array of type strings and choose one at random
    let itemTypes = Object.values(ItemTypes);
    let typeIndex = Math.floor(Math.random() * itemTypes.length);
    let typeToFetch = itemTypes[typeIndex];

    if (typeToFetch !== 'armor') {
      typeToFetch += 's';
    }

    const minLvl = 1;
    const maxLvl = lvl;

    const fetchURL = `/${typeToFetch}-in-level-range?min-level=${minLvl}&max-level=${maxLvl}`;
    
    let possibleItems;
    try {
      possibleItems = await fetch(fetchURL);
    } catch (err) {
      console.log(err);
    }

    if (possibleItems) {
      possibleItems = possibleItems.json();
    }

    return possibleItems;
  }

  const getItemForSupply = function(lvl) {
    let newItem;
    fetchItemArrForSupply(lvl)
      .then(itemsOfLevel => {
        console.log(itemsOfLevel);
        console.log(itemsOfLevel[0]);
        console.log(typeof itemsOfLevel);
        if (typeof itemsOfLevel === 'object') {
          newItem = itemsOfLevel;
        } else {
          let randomChoice = Math.floor(Math.random() * itemsOfLevel.length);
          newItem = itemsOfLevel[randomChoice];
        }
      })
      .catch(err => console.log(err));

    return newItem;
  }
  
  return {
    getSupplies: function() {
      return supplies;
    },
    fillSupplies: function(lvl) {
      for (let supplyNum = 0; supplyNum < dailySupplies; supplyNum++) {
        let newItem = getItemForSupply(lvl);
        console.log(newItem);
        supplies.push(newItem);
      }
    }
  }
}());

export default supplies;