import ItemTypes from '../Utilities/itemTypes';
import Items from './items';

// redux imports
import { store } from '../index';
import { SET_SUPPLY_READY } from '../actions/types';

const supplies = (function(){
  let supplies = [];

  const dailySupplies = 10;

  const dispatchReady = function(value) {
    const payload = {
      type: SET_SUPPLY_READY,
      value: value
    }
    store.dispatch(payload);
  }

  // fetch an item from backend
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

  // take an item that was fetched from backend and create it
  // with item constructors and put it into state
  const getItemForSupply = function(lvl, num) {
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

        if (num === dailySupplies - 1) {
          dispatchReady(true);
        }

        return true;
      }).catch(err => console.log(err));
  }
  
  return {
    getSupplies: function() {
      return supplies;
    },
    fillSupplies: function(lvl) {
      for (let supplyNum = 0; supplyNum < dailySupplies; supplyNum++) {
        getItemForSupply(lvl, supplyNum);
      }
      
    },
    depleteSupply: function(id) {
      let supplyIndex = supplies.findIndex(thisSupply => thisSupply.id === id);
      console.log(`id: ${id}, supplyIndex: ${supplyIndex}`);
      if (supplyIndex >= 0) {
        let chosenSupply = supplies.splice(supplyIndex, 1);
        console.log(chosenSupply);
        return chosenSupply;
      }
    }
  }
}());

export default supplies;