import ItemTypes from '../Utilities/itemTypes';
import Items from './items';

// redux imports
import { store } from '../index';
import { SET_SUPPLY_READY, SET_SUPPLY_SPAWNED } from '../actions/types';

const supplies = (function(){
  let supplies = [];

  let suppliesPool = {};
  let supplyLevel = 1;

  const itemTypesArr = Object.values(ItemTypes);
  const itemTypeCount = itemTypesArr.length;
  let itemSpawnCount = 0;

  const dailySupplies = 10;

  const dispatchReady = function(value) {
    const payload = {
      type: SET_SUPPLY_READY,
      value: value
    }
    store.dispatch(payload);
  }

  const dispatchSpawned = function(value) {
    const payload = {
      type: SET_SUPPLY_SPAWNED,
      value: value
    }
    store.dispatch(payload);
  }

  // fill supply pool
  const fetchSupplyPool = function() {
    // produce array of type strings and choose one at random
    itemSpawnCount = 0;
    itemTypesArr.forEach(typeItem => {
      if (suppliesPool[typeItem] == null) {
        suppliesPool[typeItem] = [];
      }
      suppliesPool[typeItem].length = 0;
    });

    getItemForSupplyPool();
    return true;
  }

  // fetch an item from backend
  const fetchItemArrForSupplyPool = async function() {
    let lvl = supplyLevel;
    if (!lvl) return;

    let typeToFetch = itemTypesArr[itemSpawnCount];

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
  const getItemForSupplyPool = function() {
    if (itemSpawnCount >= itemTypeCount) {
      return;
    }
    let newItems;
    fetchItemArrForSupplyPool()
      .then(itemsOfLevel => {
        newItems = itemsOfLevel.filter(item => item.item.rarity === 1000);
      
        // initialize field on pool if need be
        if (suppliesPool[itemTypesArr[itemSpawnCount]] === null) {
          suppliesPool[itemTypesArr[itemSpawnCount]] = [];
        }
        // push item id into supplies
        suppliesPool[itemTypesArr[itemSpawnCount]].push(newItems);

        itemSpawnCount++;
        if (itemSpawnCount === itemTypeCount) {
          dispatchSpawned(true);
        }
        getItemForSupplyPool();
        return true;
      }).catch(err => console.log(err));
  }

  const spawnSupply = function() {
    // produce array of type strings and choose one at random
    let typeIndex = Math.floor(Math.random() * itemTypesArr.length);
    let typeToSpawn = itemTypesArr[typeIndex];
    const newSupplyArr = suppliesPool[typeToSpawn];
    let randomChoice = Math.floor(Math.random() * newSupplyArr.length);
    let newItem = newSupplyArr[randomChoice];

    if (Array.isArray(newItem)) {
      newItem = newItem[0];
    }

    // compose payload for Item constructor
    // let itemPayload = {};
    // itemPayload.level = newItem.level;
    // switch(newItem.item.type) {
    //   case ItemTypes.potion:
    //     itemPayload.type = newItem.type;
    //     break;
    //   case ItemTypes.weapon:
    //     itemPayload.damage = newItem.damage;
    //     break;
    //   case ItemTypes.armor:
    //     itemPayload.armor = newItem.armor;
    //     break;
    //   default:
    //     break;
    // }
    // let payload = {};
    // payload.itemPayload = itemPayload;
    // payload.type = newItem.item.type;
    // payload.name = newItem.item.name;
    // payload.value = newItem.item.value;
    // payload.prototypeId = newItem.item.id;
    // payload.rarity = newItem.item.rarity;
    let payload = Items.composePayloadFromProto(newItem);

    // create item and add to total inventory in Items module
    let itemId = Items.createItem(payload);
    supplies.push(itemId);

  }
  
  return {
    getSupplies: function() {
      return supplies;
    },
    fillSupplies: function() {
      for (let i = 0; i < dailySupplies; i++) {
        spawnSupply();
      }
      dispatchReady(true);
    },
    fillSupplyPool: function() {
      fetchSupplyPool();
    },
    depleteSupply: function(id) {
      let supplyIndex = supplies.indexOf(id);
      if (supplyIndex >= 0) {
        let chosenSupply = supplies.splice(supplyIndex, 1);
        return chosenSupply;
      }
    },
    setSupplyLevel: function(lvl) {
      supplyLevel = lvl;
    }
  }
}());

export default supplies;