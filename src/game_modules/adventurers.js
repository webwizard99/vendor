// constant imports
import gameConstants from './gameConstants';

// game imports
import storeInventory from './storeInventory';
import playerStore from './store';
import items from './items';

// utility imports
import fetcher from '../Utilities/fetcher';
import itemTypes from '../Utilities/itemTypes';

// redux imports
import { store } from '../index';
import { SET_ADVENTURERS } from '../actions/types';

const adventurers = (function(){
  let adventurers = [];
  let currentId = 0;

  const Adventurer = function(payload) {
    const { name, 
      strength, 
      speed, 
      cunning, 
      intelligence,
      constitution,
      dungeonBehavior,
      townBehavior,
      adventurerClass } = payload;
      this.name = name;
      this.strength = strength;
      this.speed = speed;
      this.cunning = cunning;
      this.intelligence = intelligence;
      this.constitution = constitution;
      this.dungeonBehavior = dungeonBehavior;
      this.townBehavior = townBehavior;
      this.adventurerClass = adventurerClass;
      this.gold = gameConstants.adventurerStartingGold;
      this.level = 1;
      this.experience = 0;
      this.hp = 7 + constitution;
      this.maxHp = this.hp;
      this.inventory = [];
      this.equipment = { weapon: null, armor: null };
      this.inDungeon = false;
      this.informed = false;
      this.id = currentId;
      currentId++;
  }

  Adventurer.prototype.checkAccount = function(value) {
    return this.gold >= value;
  }

  Adventurer.prototype.chargeAccount = function(value) {
    this.gold -= value;
  }

  Adventurer.prototype.unequipItem = function(slot) {
    this.equipment[slot] = null;
  }

  Adventurer.prototype.equipItem = function(item) {
    this.equipment[item.type] = item;
  }

  const dispatchAdventurers = function(newAdventurers) {
    const payload = {
      type: SET_ADVENTURERS,
      payload: newAdventurers
    }
    store.dispatch(payload);
  }

  const fetchAdventurers = async function() {
    let initAdventurers = fetcher.fetchRoute('adventurers-full');
    return initAdventurers;
  }

  const getAdventurers = function*() {
    yield fetchAdventurers();
  }

  const doInn = function() {
    const availableAdventurers = adventurers.filter(adventurer => adventurer.inDungeon === false);
    availableAdventurers.forEach(townAdventurer => {
      let totalFactor = townAdventurer.townBehavior.use_tavern / 1000;
      if (townAdventurer.informed) {
        totalFactor = 0;
      }
      const willDrink = totalFactor >= Math.random();

      if (willDrink) {
        const totalCost = 10 * townAdventurer.level;
        if (townAdventurer.checkAccount(totalCost)) {
          townAdventurer.chargeAccount(totalCost);
          townAdventurer.informed = true;
        }
      }
    })
  }

  const doShopping = function() {
    const inventory = storeInventory.getStoreInventory();
    let inventoryItems = [];
    inventory.forEach(item => {
      let composedItem = item;
      composedItem.item = items.getItem(item.itemId);
      inventoryItems.push(composedItem);
    });
    const shoppingAdventurers = adventurers.filter(adventurer => adventurer.inDungeon === false);
    let adventurerTurn = 0;
    const adventurerCount = shoppingAdventurers.length;
    // loop through each inventory item
    inventoryItems.forEach(item => {
      // create an order based on last adventurer to take an
      // item and proceed suequentially to include all
      // adventurers
      let adventurerTries = [];
      for (let i = 0; i < adventurerCount; i++) {
        let thisIndex = adventurerTurn + i;
        if (thisIndex >= adventurerCount) {
          thisIndex -= adventurerCount;
        }
        adventurerTries.push(thisIndex);
      }
      let taken = false;

      // check with each adventurer if they want the item
      adventurerTries.forEach(adventurerIndex => {
        let decisionFactor = '';
        const thisAdventurer = shoppingAdventurers[adventurerIndex];

        if (thisAdventurer.equipment[item.item.type] && item.item.type !== itemTypes.potion) {
          decisionFactor += 'upgrade';
        } else {
          decisionFactor += 'buy';
        }
        decisionFactor += '_' + item.item.type;
        const desireWeight = thisAdventurer.townBehavior[decisionFactor];
        let totalFactor = (desireWeight / 1000) - (item.markup / 1000);
        if (totalFactor < 0) {
          totalFactor = 0;
        }
        let willBuy = totalFactor >= Math.random();
        if (thisAdventurer.equipment[item.item.type]) {
          const currentGear = thisAdventurer.equipment[item.item.type];
          if (item.item.type === itemTypes.weapon) {
            const currentDamage = currentGear[itemTypes.weapon].damage;
            const itemDamage = currentGear[itemTypes.weapon].damage;
            if (currentDamage >= itemDamage) {
              willBuy = false;
            }
          } else if (item.item.type === itemTypes.armor) {
            const currentArmor = currentGear[itemTypes.armor].armor;
            const itemArmor = item.item[itemTypes.armor].armor;
            if (currentArmor >= itemArmor) {
              willBuy = false;
            }
          }
        }
        if (willBuy && !taken) {
          const totalPrice = Math.floor(item.item.value * (1 + (item.markup / 1000)));
          if (thisAdventurer.checkAccount(totalPrice)) {
            thisAdventurer.chargeAccount(totalPrice);
            playerStore.creditGold(totalPrice);
            playerStore.updateGold();
            storeInventory.removeItem(item.itemId);
            storeInventory.updateStoreInventory();
            thisAdventurer.inventory.push(item.item);
            if (!item.item.type === itemTypes.potion) {
              if (thisAdventurer.equipment[item.item.type]) {
                thisAdventurer.unequipItem(item.item.type);
              }
              thisAdventurer.equipItem(item.item);
            }
            taken = true;
            adventurerTurn = adventurerIndex + 1;
            if (adventurerTurn > adventurerCount) {
              adventurerTurn = 0;
            }
          }
        }
      })
    })
  }

  return {
    initializeAdventurers: async function(maxAdventurers) {
      const genGetAdventurers = getAdventurers();
      genGetAdventurers.next().value
        .then(initAdventurers => {
          if (initAdventurers) {
            let drainAdventurers = initAdventurers;
            while (adventurers.length < maxAdventurers && drainAdventurers.length > 0) {
              const pushIndex = Math.floor(Math.random() * drainAdventurers.length);
              let newAdventurer = drainAdventurers.splice(pushIndex, 1);
              newAdventurer = newAdventurer[0];
              const adventurerPayload = {
                name: newAdventurer.name,
                strength: newAdventurer.strength, 
                speed: newAdventurer.speed, 
                cunning: newAdventurer.cunning, 
                intelligence: newAdventurer.intelligence,
                constitution: newAdventurer.constitution,
                dungeonBehavior: newAdventurer.dungeon_behavior,
                townBehavior: newAdventurer.town_behavior,
                adventurerClass: newAdventurer.adventurer_class
              };
              let thisAdventurer = new Adventurer(adventurerPayload);
              adventurers.push(thisAdventurer);
            }
            dispatchAdventurers(adventurers);
            return adventurers;
          }
        })
    },
    updateAdventurers: function() {
      dispatchAdventurers(adventurers);
    },
    takeAdventurerTurn: function() {
      doInn();
      doShopping();
      dispatchAdventurers(adventurers);
    }
  }
}());

export default adventurers;