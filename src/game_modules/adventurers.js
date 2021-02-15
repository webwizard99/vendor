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
  // const maxActionTurns = 10;

  // const actions = {
  //   checkForTreasure: 'checkForTreasure',
  //   checkForTraps: 'checkForTraps',
  //   setTrap: 'setTrap'
  // }

  const decisions = {
    usePotion: 'usePotion',
    advance: 'advance',
    checkForTraps: 'checkForTraps',
    checkForTreasure: 'checkForTreasure',
    setTrap: 'setTrap',
    returnToTown: 'returnToTown',
    advanceNextLevel: 'advanceNextLevel'
  }

  const setTrapBehavior = {
    thief: 600,
    soldier: 200,
    bard: 450
  }

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
      this.hasFoundStairs = false;
      this.currentTotalDungeonTurns = 0;
      this.currentAction = null;
      this.currentActionTurns = 0;
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

  Adventurer.prototype.checkHealthChoice = function() {
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    let decisionFactor = percentLost + (this.dungeonBehavior.conserve_health / 1000);
    const needHealing = decisionFactor > Math.random();
    return needHealing;
  }

  Adventurer.prototype.checkHasPotion = function() {
    return this.inventory.find(item => item.item.type === itemTypes.potion);
  }

  Adventurer.prototype.checkPotionUse = function() {
    let decisionFactor = (this.dungeonBehavior.use_potion / 1000);
    const usePotion = decisionFactor > Math.random();
    return usePotion;
  }

  Adventurer.prototype.usePotion = function() {
  // let heldPotions = this.inventory.filter(item => item.item.type === itemTypes.potion);
    
  }

  Adventurer.prototype.checkTrapDecision = function() {
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    let decisionFactor = (percentLost * 3) + (this.dungeonBehavior.check_for_traps / 1000);
    const checkTraps = decisionFactor > Math.random();
    return checkTraps;
  }

  Adventurer.prototype.checkTreasureDecision = function() {
    const decisionFactor = (this.dungeonBehavior.search_for_treasure / 1000);
    const checkTreasure = decisionFactor > Math.random();
    return checkTreasure;
  }

  Adventurer.prototype.checkSetTrapDecision = function() {
    const setTrap = setTrapBehavior[this.adventurerClass.name];
    console.log(setTrap);
    const decisionFactor = (setTrap / 1000) + (this.dungeonBehavior.prefer_weaker_monster / 4000);
    const doSetTrap = decisionFactor > Math.random();
    return doSetTrap;
  }

  Adventurer.prototype.checkAdvanceDecision = function() {
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    const inventoryCount = this.inventory.length;
    const inventoryPercentEmpty = maxInventory - (inventoryCount / maxInventory);
    const fillInventoryDesire = ((this.dungeonBehavior.fill_inventory) * inventoryPercentEmpty) / 1000;
    const decisionFactor = (this.dungeonBehavior.advance_tile / 1000) - (percentLost * 2) - (this.currentTotalDungeonTurns / 600) + (fillInventoryDesire * 3);
    const advanceDecision = decisionFactor > Math.random();
    return advanceDecision;
  }

  Adventurer.prototype.checkReturnToTown = function() {
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    let turnsInfluence = 1;
    let turnsFactor;
    if (this.currentTotalDungeonTurns < 15) {
      turnsInfluence = -1;
      turnsFactor = (15 - (turnsInfluence * this.currentTotalDungeonTurns)) / 15; 
    } else {
      turnsFactor = (turnsInfluence * this.currentTotalDungeonTurns) / 400;
    }
    const inventoryCount = this.inventory.length;
    const inventoryPercentEmpty = maxInventory - (inventoryCount / maxInventory);
    const fillInventoryDesire = ((this.dungeonBehavior.fill_inventory) * inventoryPercentEmpty) / 1000;
    const decisionFactor = (this.dungeonBehavior.return_to_town / 1000) - (fillInventoryDesire * 5) + (percentLost * 2) + turnsFactor;
    const returnDecision = decisionFactor > Math.random();
    return returnDecision; 
  }

  const Decision = function(adventurerId) {
    this.adventurerId = adventurerId;
    this.needHealing = false;
    this.hasPotion = false;
    this.usePotion = false;
    this.checkForTraps = false;
    this.checkForTreasure = false;
    this.setTrap = false;
    this.advance = false;
    this.returnToTown = false;
  }

  Decision.prototype.weighDecisionLogical = function() {
    if (this.needHealing && this.hasPotion && this.usePotion && !this.advance) {
      return decisions.usePotion;
    }
    if (!this.usePotion && this.advance && !this.checkForTraps && !this.checkTreasure) {
      return decisions.advance;
    }
    if (this.returnToTown && !this.usePotion && !this.hasPotion && !this.advance) {
      return decisions.returnToTown;
    }
    return false;
  }

  Decision.prototype.weighDecisionTournament = function() {
    const concernedAdventurer = adventurers.find(adventurer => adventurer.id === this.adventurerId);
    let remainingOptions = [];
    const weights = {
      usePotion: concernedAdventurer.dungeonBehavior.use_potion,
      checkForTraps: concernedAdventurer.dungeonBehavior.check_for_traps,
      checkForTreasure: concernedAdventurer.dungeonBehavior.search_for_treasure,
      setTrap: setTrapBehavior[concernedAdventurer.adventurerClass.name],
      advance: concernedAdventurer.dungeonBehavior.advance_tile,
      returnToTown: concernedAdventurer.dungeonBehavior.return_to_town
    }
    if (this.usePotion && this.hasPotion) {
      remainingOptions.push(decisions.usePotion);
    }
    if (this.checkForTraps) {
      remainingOptions.push(decisions.checkForTraps);
    }
    if (this.checkForTreasure) {
      remainingOptions.push(decisions.checkForTreasure);
    }
    if (this.setTrap) {
      remainingOptions.push(decisions.setTrap);
    }
    if (this.advance) {
      remainingOptions.push(decisions.advance);
    }
    if (this.returnToTown) {
      remainingOptions.push(decisions.returnToTown);
    }
    if (remainingOptions.length === 1) {
      return remainingOptions[0];
    }

    const tournamentRounds = Math.ceil(Math.log2(remainingOptions.length));
    console.log(tournamentRounds);
    for (let round = 0; round < tournamentRounds; round++) {
      console.log(remainingOptions);
      const optionsLength = remainingOptions.length;
      let pairings = [];
      const pairCount = Math.floor(optionsLength / 2);
      for (let offest = 0; offest < pairCount; offest++) {
        const pair = [remainingOptions[offest], remainingOptions[optionsLength - (offest + 1)]];
        console.log(pair);
        pairings.push(pair);
      }
      console.log(pairings);
      let eliminated = [];
      pairings.forEach(pair => {
        const result1 = Math.random() * weights[pair[0]];
        const result2 = Math.random() * weights[pair[1]];
        console.log(`pair[0]: ${pair[0]}, result: ${result1}; pair[1]: ${pair[1]}, result: ${result2}`);
        const randomChoice = Math.random();
        
        if (result1 > result2 || (result1 === result2 && randomChoice < .5)) {
          eliminated.push(pair[1])
        } else {
          eliminated.push(pair[0]);
        }
      });
      console.log(eliminated);
      for (let elIndex = 0; elIndex < eliminated.length; elIndex++) {
        const eliminate = eliminated[elIndex];
        console.log(`eliminate: ${eliminate}`);
        remainingOptions = remainingOptions.filter(option => option !== eliminate);
      }
    }
    return remainingOptions[0];
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
              <span className={filterClasses.name}>{townAdventurer.name} </span>  stayed at the inn. <span className={filterClasses.name}>{townAdventurer.name} </span> is now <span className={filterClasses.status}>informed</span>.
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
            <span className={filterClasses.name}>{dungeonAdventurer.name} </span> entered the dungeon.
          </div>
        );
        dungeonAdventurer.inDungeon = true;
        dungeonAdventurer.currentTotalDungeonTurns = 0;
        const combatLogMessage = dungeonJSX;
        dungeonAdventurer.addCombatLog(combatLogMessage);
        dungeon.receiveAdventurer(dungeonAdventurer.id);
      }
    })
  }

  const dungeonTurns = function() {
    const dungeonAdventurers = adventurers.filter(adventurer => adventurer.inDungeon === true);
    dungeonAdventurers.forEach(dungeonAdventurer => {
      let remainingTurns = dungeonAdventurer.speed;
      while (remainingTurns > 0) {
        let turnTaken = false;
        let thisDecision = new Decision(dungeonAdventurer.id);
        if (dungeonAdventurer.hp < dungeonAdventurer.maxHp) {
          thisDecision.needHealing = dungeonAdventurer.checkHealthChoice();
          thisDecision.hasPotion = dungeonAdventurer.checkHasPotion();
          if (thisDecision.needHealing) {
            if (thisDecision.hasPotion) {
              thisDecision.usePotion = dungeonAdventurer.checkPotionUse();
            }
          }
        }
        thisDecision.checkForTraps = dungeonAdventurer.checkTrapDecision();
        thisDecision.checkForTreasure = dungeonAdventurer.checkTreasureDecision();
        thisDecision.advance = dungeonAdventurer.checkAdvanceDecision();
        thisDecision.returnToTown = dungeonAdventurer.checkReturnToTown();
        thisDecision.setTrap = dungeonAdventurer.checkSetTrapDecision();
        console.log(thisDecision);

        // get decision from decision object
        let resultDecision;
        resultDecision = thisDecision.weighDecisionLogical();
        if (!resultDecision) {
          resultDecision = thisDecision.weighDecisionTournament();
        }
        console.log(resultDecision);

        if (!turnTaken) {
          turnTaken = true;
        }
        
        remainingTurns -= 1;
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
      dungeonTurns()
      dispatchAdventurers(adventurers);
    }
  }
}());

export default adventurers;