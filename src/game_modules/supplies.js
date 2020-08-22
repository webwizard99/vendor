import ItemTypes from '../Utilities/itemTypes';
import Items from './items';

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
        if (Array.isArray(itemsOfLevel)) {
          let randomChoice = Math.floor(Math.random() * itemsOfLevel.length);
          newItem = itemsOfLevel[randomChoice];
        }

        // compose payload for Item constructor
        let itemPayload = {};
        itemPayload.level = newItem.level;
        switch(newItem.item.type) {
          case ItemTypes.potion:
            itemPayload.type = newItem.type;
            break;
          case ItemTypes.weapon:
            itemPayload.damage = newItem.damage;
            break;
          case ItemTypes.armor:
            itemPayload.armor = newItem.armor;
            break;
          default:
            break;
        }
        let payload = {};
        payload.itemPayload = itemPayload;
        payload.type = newItem.item.type;
        payload.name = newItem.item.name;
        payload.value = newItem.item.value;

        // create item and add to total inventory in Items module
        let itemId = Items.createItem(payload);
        // push item id into supplies
        supplies.push(itemId);

        return true;
      }).catch(err => console.log(err));
  }
  
  return {
    getSupplies: function() {
      return supplies;
    },
    fillSupplies: function(lvl) {
      for (let supplyNum = 0; supplyNum < dailySupplies; supplyNum++) {
        getItemForSupply(lvl);
      }
    },
    depleteSupply: function(id) {
      let supplyIndex = supplies.findIndex(thisSupply => thisSupply.id === id);
      if (supplyIndex >= 0) {
        let chosenSupply = supplies.splice(supplyIndex, 1);
        return chosenSupply;
      }
    }
  }
}());

export default supplies;