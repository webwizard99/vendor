import React from 'react';

// constant imports
import gameConstants from './gameConstants';

// game imports
import storeInventory from './storeInventory';
import playerStore from './store';
import items from './items';
import dungeon from './dungeon';

// utility imports
import fetcher from '../Utilities/fetcher';
import itemTypes from '../Utilities/itemTypes';
import tagProcessor from '../Utilities/tagProcessor';

// redux imports
import { store } from '../index';
import { SET_ADVENTURERS } from '../actions/types';

const adventurers = (function(){
  let adventurers = [];
  let currentId = 0;

  const maxInventory = 15;

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

  Adventurer.prototype.getCurrentItemCount = function(protoId) {
    if (this.inventory.length <= 0) return 0;
    let protoCount = 0;
    for (let item of this.inventory) {
      if (item.prototypeId === protoId) {
        protoCount++;
      }
    }
    return protoCount;
  }

  Adventurer.prototype.addCombatLog = function(message) {
    if (! this.combatLog) {
      this.combatLog = [];
    }
    this.combatLog.push(message);
  }

  Adventurer.prototype.getCombatLog = function() {
    if (! this.combatLog) {
      this.combatLog = [];
    }
    return this.combatLog;
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
          const filterClasses = tagProcessor.getFilterClasses();
          const innJSX = (
            <div className="combatLogEntry">
              <span className={filterClasses.name}>{townAdventurer.name}</span>  stayed at the inn. <span className={filterClasses.name}>{townAdventurer.name}</span> is now <span className={filterClasses.status}>informed</span>.
            </div>);
          townAdventurer.chargeAccount(totalCost);
          townAdventurer.informed = true;
          const combatLogMessage = innJSX;
          townAdventurer.addCombatLog(combatLogMessage);
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
        // determine if decision factor is buy or upgrade
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
        // lessen desire to buy item if adventurer currently has some of it
        const itemProto = item.item.prototypeId;
        const currentHoldings = thisAdventurer.getCurrentItemCount(itemProto);
        if (item.item.type === itemTypes.potion) {
          totalFactor -= (currentHoldings * .10);
        } else {
          totalFactor -= (currentHoldings * .30);
        }
        // determine if adventurer will buy item
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
        // cancel buy if adventurer inventory is full
        if (thisAdventurer.inventory.length >= maxInventory) {
          willBuy = false;
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

  const dungeonEntry = function() {
    const dungeonGoingAdventurers = adventurers.filter(adventurer => adventurer.inDungeon === false);
    dungeonGoingAdventurers.forEach(dungeonAdventurer => {
      let totalFactor = (dungeonAdventurer.townBehavior.enter_dungeon / 1000)
      let willEnter = totalFactor >= Math.random();

      if (willEnter) {
        const filterClasses = tagProcessor.getFilterClasses();
        const dungeonJSX = (
          <div className="combatLogEntry">
            <span className={filterClasses.name}>{dungeonAdventurer.name}</span> entered the dungeon.
          </div>
        );
        dungeonAdventurer.inDungeon = true;
        const combatLogMessage = dungeonJSX;
        dungeonAdventurer.addCombatLog(combatLogMessage);
        dungeon.receiveAdventurer(dungeonAdventurer.id);
      }
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
      dungeonEntry();
      dispatchAdventurers(adventurers);
    }
  }
}());

export default adventurers;