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
    
    let possibleItems;
    try {
      possibleItems = await fetch(`${typeToFetch}-in-level-range/${minLvl}/${maxLvl}`);
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
    fetchItemArrForSupply()
      .then(itemsOfLevel => {
        let randomChoice = Math.floor(Math.random() * itemsOfLevel.length);
        newItem = itemsOfLevel[randomChoice];
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
        supplies.push(getItemForSupply());
      }
    }
  }
}());

export default supplies;