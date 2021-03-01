import React from 'react';

// constant imports
import gameConstants from './gameConstants';

// game imports
import storeInventory from './storeInventory';
import playerStore from './store';
import items from './items';
import dungeon from './dungeon';
import days from './days';

// utility imports
import fetcher from '../Utilities/fetcher';
import itemTypes from '../Utilities/itemTypes';
import tagProcessor from '../Utilities/tagProcessor';

// redux imports
import { store } from '../index';
import { SET_ADVENTURERS, SET_DETAIL_UPDATE } from '../actions/types';

const adventurers = (function(){
  let adventurers = [];
  let currentId = 0;

  const maxInventory = 15;
  const defaultActionDays = 2;

  const actions = {
    checkForTreasure: 'checkForTreasure',
    checkForTraps: 'checkForTraps',
    setTrap: 'setTrap'
  }

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
      this.action = {
        currentAction: null,
        turns: 0
      }
      this.id = currentId;
      this.defending = false;
      currentId++;
  }

  Adventurer.prototype.checkAccount = function(value) {
    return this.gold >= value;
  }

  Adventurer.prototype.chargeAccount = function(value) {
    this.gold -= value;
  }

  Adventurer.prototype.creditAccount = function(value) {
    this.gold += value;
  }

  Adventurer.prototype.unequipItem = function(slot) {
    this.equipment[slot] = null;
  }

  Adventurer.prototype.equipItem = function(item) {
    this.equipment[item.type] = item;
    console.log(this.equipment);
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
    console.log(this.inventory);
    if (this.inventory.length < 1) return false;
    return this.inventory.find(item => item.type === itemTypes.potion);
  }

  Adventurer.prototype.checkPotionUse = function() {
    let decisionFactor = (this.dungeonBehavior.use_potion / 1000);
    const usePotion = decisionFactor > Math.random();
    return usePotion;
  }

  Adventurer.prototype.usePotion = function() {
    const filterClasses = tagProcessor.getFilterClasses();
    let heldPotions = this.inventory.filter(item => item.type === itemTypes.potion);
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    let potionToUse;
    if (percentLost > .5) {
      heldPotions.sort((potion1, potion2) => {
        if (potion1[itemTypes.potion].level < potion2[itemTypes.potion].level) {
          return 1;
        } else if (potion1[itemTypes.potion].level > potion2[itemTypes.potion].level) {
          return -1;
        } else return 0;
      });
      potionToUse = heldPotions[0];
    } else {
      heldPotions.sort((potion1, potion2) => {
        if (potion1[itemTypes.potion].level < potion2[itemTypes.potion].level) {
          return -1;
        } else if (potion1[itemTypes.potion].level > potion2[itemTypes.potion].level) {
          return 1;
        } else return 0;
      });
      potionToUse = heldPotions[0];
    }
    let hpToHeal = Math.floor(potionToUse[itemTypes.potion].level * (4 * Math.pow(1.08, potionToUse[itemTypes.potion].level)));
    if (hpToHeal > hpDifferential) {
      hpToHeal = hpDifferential;
    }
    this.hp = this.hp + hpToHeal;
    const healJSX = (
      <div className="combatLogEntry">
        <span className={filterClasses.name}>{this.name} </span>  used {potionToUse.name}. <span className={filterClasses.name}>{this.name} </span> healed <span className={filterClasses.value}>{hpToHeal}</span>hp.
      </div>);
    this.addCombatLog(healJSX);
    this.inventory = this.inventory.filter(item => item.id !== potionToUse.id);
    items.destroyItem(potionToUse.id);
    potionToUse = null;
    console.log('use potion');
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

  Adventurer.prototype.considerTreasure = function(item) {
    console.log(item);
    if (this.inventory.length < maxInventory) {
      this.inventory.push(item);
      return true;
    }
    // insert logic for weighing item values if inventory is full
  }

  Adventurer.prototype.encounterTrap = function(dungeonLevel) {
    const filterClasses = tagProcessor.getFilterClasses();
    const trapDamage = 3 * (Math.pow(1.25, (dungeonLevel - 1)));
    const trapFactor = (this.adventurerClass.traps + this.adventurerClass.agility + this.cunning) / ((this.level * 10) * (Math.pow(1.25, (dungeonLevel - 1))));
    let computedDamage = Math.floor(trapDamage * (1 / trapFactor));
    const avoidTrapChance = Math.random() * trapFactor;
    if (avoidTrapChance > Math.random() * 10) {
      const trapJSX = (
        <div className="combatLogEntry">
          <span className={filterClasses.name}>{this.name} </span> avoided a trap.
        </div>);
      this.addCombatLog(trapJSX);
      return false;
    }
    console.log(`trapDamage: ${computedDamage}`);
    if (computedDamage > this.hp) {
      computedDamage = this.hp;
    }
    this.hp -= computedDamage;
    const trapJSX = (
      <div className="combatLogEntry">
        <span className={filterClasses.name}>{this.name}</span> took <span className={filterClasses.value}>{computedDamage}</span> damage from a trap!
      </div>);
    this.addCombatLog(trapJSX);
  }

  Adventurer.prototype.logTrap = function(payload) {
    const {
      trapDamage,
      monsterName
    } = payload;
    const filterClasses = tagProcessor.getFilterClasses();
    const trapJSX = (
      <div className="combatLogEntry">
        <span className={filterClasses.name}>{this.name}</span>'s' trap hit <span className={filterClasses.monsterName}>{monsterName}</span> for <span className={filterClasses.value}>{trapDamage}</span> damage.
      </div>);
    this.addCombatLog(trapJSX);
  }

  Adventurer.prototype.unsetTrap = function() {
    this.action = {
      currentAction: null,
      turns: 0
    };
  }

  Adventurer.prototype.getInitiativeRoll = function() {
    const initiativeFactor = ((this.adventurerClass.tactics * .7) / 10) + ((this.adventurerClass.agility * .3) / 10);
    return Math.random() * initiativeFactor;
  }

  Adventurer.prototype.takeBattleDamage = function(payload) {
    const {
      monsterName,
      damage
    } = payload;
    let computedDamage = damage;
    if (computedDamage > this.hp) {
      computedDamage = this.hp
    }
    this.hp -= computedDamage;

    let battleJSX;
    if (computedDamage > 0) {
      battleJSX = (
        <div className="combatLogEntry">
          <span className={filterClasses.monsterName}>{monsterName}</span> hit <span className={filterClasses.name}>{this.name}</span> for <span className={filterClasses.value}>{computedDamage}</span> damage. 
        </div>);
    } else {
      battleJSX = (
        <div className="combatLogEntry">
          <span className={filterClasses.monsterName}>{monsterName}</span> attempted to hit <span className={filterClasses.name}>{this.name}</span>, but did no damage. 
        </div>)
    }
    
    this.addCombatLog(battleJSX);
  }

  // Adventurer.prototype.checkFlee = function() {

  // }

  const TurnController = function() {
    this.currentTurns = [];
    this.currentId = 0;
  }

  TurnController.prototype.addTurn = function(turn) {
    turn.id = this.currentId;
    this.currentTurns.push(turn);
    this.currentId++;
  }

  TurnController.prototype.clearTurn = function(id) {
    let deletedTurn = this.currentTurns.find(foundTurn => foundTurn.id === id);
    this.currentTurns = this.currentTurns.filter(clearTurn => clearTurn.id!== id);
    if (deletedTurn) {
      deletedTurn = null;
    }
    if (this.currentTurns.length === 0) {
      this.currentId = 0;
      dispatchUpdate();
    }
  }

  TurnController.prototype.clearAdventurerTurns = function(payload) {
    const {
      adventurerId,
      day
    } = payload;
    let deletedTurns = this.currentTurns.find(foundTurn => foundTurn.adventurerId === adventurerId  && this.foundTurn.day === day);
    this.currentTurns = this.currentTurns.filter(clearTurn => clearTurn.adventurerId !== adventurerId && clearTurn.day !== day);
    deletedTurns.forEach(turn => {
      turn = null
    });
  }

  TurnController.prototype.startTurns = function() {
    if (this.currentTurns.length === 0) return false;
    const firstTurns = this.currentTurns.filter(turn => turn.turnNumber === 1);
    firstTurns.forEach(turn => {
      turn.runTurn();
    });
  }

  TurnController.prototype.startTurn = function(payload) {
    const {
      adventurerId,
      day,
      turn
    } = payload;
    const nextTurn = this.currentTurns.find(foundTurn => foundTurn.adventurerId === adventurerId && foundTurn.day === day && foundTurn.turnNumber === turn);
    if (nextTurn) {
      nextTurn.runTurn();
    } 
  }


  let turnController;

  const initializeTurnController = function() {
    turnController = new TurnController();
  }

  const Turn = function(payload) {
    const {
      adventurer,
      day,
      turnNumber,
      nextTurn
    } = payload;
    this.adventurer = adventurer;
    this.adventurerId = adventurer.id;
    this.day = day;
    this.turnNumber = turnNumber;
    this.nextTurn = nextTurn;
  }

  Turn.prototype.runTurn = async function() {
    // console.log(`Adventurer: ${this.adventurer.name}, currentTurn: ${this.turnNumber}, nextTurn: ${this.nextTurn}`);
    const filterClasses = tagProcessor.getFilterClasses();
    new Promise((resolve, reject) => {
      const dungeonAdventurer = this.adventurer;
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
      if (!dungeonAdventurer.action.currentAction) {
        thisDecision.checkForTraps = dungeonAdventurer.checkTrapDecision();
        thisDecision.checkForTreasure = dungeonAdventurer.checkTreasureDecision();
        thisDecision.setTrap = dungeonAdventurer.checkSetTrapDecision();
      }
      thisDecision.advance = dungeonAdventurer.checkAdvanceDecision();
      thisDecision.returnToTown = dungeonAdventurer.checkReturnToTown();

      // get decision from decision object
      let resultDecision;
      resultDecision = thisDecision.weighDecisionLogical();
      if (!resultDecision) {
        resultDecision = thisDecision.weighDecisionTournament();
      }
      console.log(resultDecision);
      if (resultDecision === decisions.usePotion) {
        dungeonAdventurer.usePotion();
      }
      if (resultDecision === decisions.checkForTraps || 
        resultDecision === decisions.checkForTreasure || 
        resultDecision === decisions.setTrap) {
          dungeonAdventurer.action.currentAction = resultDecision;
          const turns = dungeonAdventurer.speed * defaultActionDays;
          dungeonAdventurer.action.turns = turns;
          let actionMsg = '';
          if (resultDecision === decisions.checkForTraps) {
            actionMsg = 'is checking for traps';
          } else if (resultDecision === decisions.checkForTreasure) {
            actionMsg = 'is checking for treasure';
          } else if (resultDecision === decisions.setTrap) {
            actionMsg = 'sets a trap';
          }
          const actionJSX = (
            <div className="combatLogEntry">
              <span className={filterClasses.name}>{dungeonAdventurer.name} </span> {actionMsg}.
            </div>);
          dungeonAdventurer.addCombatLog(actionJSX);
      }
      if (resultDecision === decisions.returnToTown){
        dungeon.releaseAdventurer(dungeonAdventurer.id);
        dungeonAdventurer.inDungeon = false;
        const clearPackage = { adventurerId: this.adventurerId, day: this.day };
        turnController.clearAdventurerTurns(clearPackage);
        resolve();
      }
      new Promise((resolveTurn, rejectTurn) => {
        if (resultDecision === decisions.advance) {
          dungeon.executeTurn(dungeonAdventurer)
            .then(() => {
              resolveTurn();
            });
        } else {
          resolveTurn();
        }
        
      }).then(() => {
        this.adventurer.currentTotalDungeonTurns++;
        resolve();
      })
    }).then(() => {
      if (this.nextTurn) {
        const payload = { turn: this.nextTurn, adventurerId: this.adventurerId, day: this.day };
        turnController.startTurn(payload);
      }
      turnController.clearTurn(this.id);
    })
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
    // populate hash table with weights for relevant behaviors
    const weights = {
      usePotion: concernedAdventurer.dungeonBehavior.use_potion,
      checkForTraps: concernedAdventurer.dungeonBehavior.check_for_traps,
      checkForTreasure: concernedAdventurer.dungeonBehavior.search_for_treasure,
      setTrap: setTrapBehavior[concernedAdventurer.adventurerClass.name],
      advance: concernedAdventurer.dungeonBehavior.advance_tile,
      returnToTown: concernedAdventurer.dungeonBehavior.return_to_town
    }
    // add decisions marked as valid to array for use in
    // creating elimination tournament
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
    // determine number of tournament rounds for iteration
    const tournamentRounds = Math.ceil(Math.log2(remainingOptions.length));
    for (let round = 0; round < tournamentRounds; round++) {
      // create pairings from outside ends inward
      const optionsLength = remainingOptions.length;
      let pairings = [];
      const pairCount = Math.floor(optionsLength / 2);
      for (let offest = 0; offest < pairCount; offest++) {
        const pair = [remainingOptions[offest], remainingOptions[optionsLength - (offest + 1)]];
        pairings.push(pair);
      }
      let eliminated = [];
      // iterate over pairings and produce weighted outcomes to
      // eliminate one decision from each pairing
      pairings.forEach(pair => {
        const result1 = Math.random() * weights[pair[0]];
        const result2 = Math.random() * weights[pair[1]];
        const randomChoice = Math.random();
        
        if (result1 > result2 || (result1 === result2 && randomChoice < .5)) {
          eliminated.push(pair[1])
        } else {
          eliminated.push(pair[0]);
        }
      });
      // remove eliminated options from array containing tournament
      // entrants
      for (let elIndex = 0; elIndex < eliminated.length; elIndex++) {
        const eliminate = eliminated[elIndex];
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

  const dispatchUpdate = function() {
    const payload = {
      type: SET_DETAIL_UPDATE,
      value: true
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
        let totalFactor = (desireWeight / 1000) - (item.markup / 1600);
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
            const baseItem = items.getItem(item.itemId);
            storeInventory.removeItem(item.itemId);
            storeInventory.updateStoreInventory();
            thisAdventurer.inventory.push(baseItem);
            if (baseItem.type !== itemTypes.potion) {
              if (thisAdventurer.equipment[baseItem.type]) {
                thisAdventurer.unequipItem(baseItem.type);
              }
              thisAdventurer.equipItem(baseItem);
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
    });
  }

  const dungeonTurns = function() {
    const dungeonAdventurers = adventurers.filter(adventurer => adventurer.inDungeon === true);
    new Promise((resolve, reject) => {
      dungeonAdventurers.forEach((dungeonAdventurer, dunAdN) => {
        let totalTurns = dungeonAdventurer.speed;
        for (let turnNumber = 1; turnNumber <= totalTurns; turnNumber++) {
          let nextTurn = 0;
          if (turnNumber < totalTurns) {
            nextTurn = turnNumber + 1;
          } else {
            nextTurn = null;
          }
          const turnPayload = {
            adventurer: dungeonAdventurer,
            day: days.getDay(),
            turnNumber: turnNumber,
            nextTurn: nextTurn
          }
          const newTurn = new Turn(turnPayload);
          turnController.addTurn(newTurn);
        }
        if (dunAdN === dungeonAdventurers.length -1) {
          resolve();
        }
      });
    }).then(() => {
      turnController.startTurns();
    });
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
            initializeTurnController();
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
      const loadNextLevel = !dungeon.checkLevelReadiness();
      if (loadNextLevel) {
        const loadLevel = dungeon.loadNextLevel();
        loadLevel.next().value.then(() => {
          dungeonEntry();
          dungeonTurns()
          dispatchAdventurers(adventurers);
        })
      } else {
        dungeonEntry();
        dungeonTurns()
        dispatchAdventurers(adventurers);
      }
    },
    getActions: function() {
      return actions;
    }
  }
}());

export default adventurers;