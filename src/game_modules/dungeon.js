// game imports
import items from './items';
import adventurersModule from './adventurers';
import monsters from './monsters';

// utility imports
import fetcher from '../Utilities/fetcher';

// redux imports
import { store } from '../index';
import { SET_DUNGEON_LEVELS, 
  SET_DUNGEON_LEVEL_EXPLORED,
  SET_DUNGEON_ADVENTURERS } from '../actions/types';

const dungeon = (function(){
  let levels = [];
  // {
  // adventurerId: n,
  // level: n
  //}
  let adventurers = [];
  let levelCount;

  let exploredLevel = 0;

  const Level = function(payload) {
    const {
      number, 
      boss, 
      bossId, 
      monstersMinLevel, 
      monstersMaxLevel,
      tileAssignments,
      treasureDropList
    } = payload;
    this.number = number;
    this.boss = boss;
    this.bossId = bossId;
    this.monstersMinLevel = monstersMinLevel;
    this.monstersMaxLevel = monstersMaxLevel;
    this.tileAssignments = tileAssignments;
    this.treasureDropList = treasureDropList;
    this.treasures = [];
    this.droppedTreasures = [];
    this.monsters = [];
    this.lurkingMonsters = [];
    this.monstersLoot = [];
    this.treasureListFetched = false;
    this.monstersFetched = false;
    this.monsterDropListItemsFetched = false;
    this.intialized = false;
  }

  Level.prototype.initialize = async function() {
    
    //const monstersToAdd = getMonstersForLevel(this.monstersMinLevel, this.monstersMaxLevel);
    return new Promise((resolve, reject) => {
      const tGetMonstersForLevel = getMonstersForLevel(this.monstersMinLevel, this.monstersMaxLevel);
      tGetMonstersForLevel.next().value.then((monstersToAdd) => {
        if (!monstersToAdd) return false;
        let monsterDrops = [];
        // compose list of items to fetch
        monstersToAdd.forEach(addMonster => {
          this.monsters.push(addMonster);
          const addMonsterDrops = addMonster.drop_list.drops;
          if (addMonsterDrops) {
            addMonsterDrops.forEach(addDrop => {
              const addId = addDrop.itemId;
              if (!monsterDrops.find(item => item.itemId === addId)) {
                monsterDrops.push({ itemId: addId, dropType: addDrop.drop_type});
              }
            })
          }
        });
  
        // compose list of items to fetch
        let treasureDrops = [];
        this.treasureDropList.drops.forEach(drop => {
          const addId = drop.itemId;
          if (!treasureDrops.find(item => item.itemId === addId)) {
            treasureDrops.push({ itemId: addId, dropType: drop.drop_type });
          }
        });
        new Promise((resolveMonsterDrops, rejectMonsterDrops) => {
          // fetch monster drop list items
          monsterDrops.forEach((monsterDrop, mDropN) => {
            const mGetDrop = getDrop(monsterDrop);
            mGetDrop.next().value.then((resolvedDrop) => {
              if (Array.isArray(resolvedDrop)) {
                resolvedDrop = resolvedDrop[0];
              }
              this.monstersLoot.push(resolvedDrop);
              if (mDropN === monsterDrops.length -1) {
                resolveMonsterDrops();
              }
            })
          });
        })
        .then(() => {
            new Promise((resolveTreasureDrops, rejectTreasureDrops) => {
              // fetch items for treasure drop lists
              treasureDrops.forEach((treasureDrop, tDropN) => {
                const tGetDrop = getDrop(treasureDrop);
                tGetDrop.next().value.then((resolvedDrop) => {
                  if (Array.isArray(resolvedDrop)) {
                    resolvedDrop = resolvedDrop[0];
                  }
                  this.treasures.push(resolvedDrop);
                  if (tDropN === treasureDrops.length -1) {
                    resolveTreasureDrops();
                  }
                });            
              })
            })
            .then(() => {
              this.initialized = true;
              console.log('level initialized.');
              resolve(true);
            });
          });
      });
    })
    
  }

  Level.prototype.activateTile = async function(adventurer) {
    return new Promise((resolve, reject) => {
      let tileOutcomes = [];
      for (let tileI = 0; tileI < this.tileAssignments.length; tileI++) {
        const weight = this.tileAssignments[tileI].probability;
        const result = Math.random() * weight;
        tileOutcomes.push({ tile: tileI, result: result });
      }
      tileOutcomes.sort((outcome1, outcome2) => {
        if (outcome1.result > outcome2.result) {
          return -1;
        } else if (outcome1.result < outcome2.result) {
          return 1;
        } else return 0;
      });
      const resultTileI = tileOutcomes[0].tile;
      const resultTile = this.tileAssignments[resultTileI].dungeon_tile;
      let innTreasureBoost = 0;
      if (adventurer.informed) {
        innTreasureBoost = 20;
      }
      const actions = adventurersModule.getActions();;
      let checkTreasureBoost = 0;
      if (adventurer.action === actions.checkForTreasure) {
        checkTreasureBoost = 10;
      }
      let checkTrapBoost = 0;
      if (adventurer.action === actions.checkForTraps) {
        checkTrapBoost = 50;
      }
      const treasureProb = Math.random() * (resultTile.treasure + innTreasureBoost + checkTreasureBoost);
      const encounterProb = Math.random() * resultTile.encounter;
      const trapProb = Math.random() * (resultTile.trap - checkTrapBoost);
      const threshholdProb = Math.random() * 125;
      // console.log(`probs... treasure: ${treasureProb}, trap: ${trapProb}, encounter: ${encounterProb}, threshold: ${threshholdProb}`);
      if (threshholdProb > treasureProb && threshholdProb > encounterProb && threshholdProb > trapProb) {
        resolve();
        return;
      }
      if (treasureProb > encounterProb && treasureProb > trapProb) {
        console.log('treasure event');
        const treasureIndex = Math.floor(Math.random() * this.treasures.length);
        const treasures = this.treasures;
        const treasure = treasures[treasureIndex];
        const treasureDropRef = this.treasureDropList.drops.find(drop => drop.itemId === treasure.id);
        const itemDropped = (treasureDropRef.dropChance / 1000) > Math.random();
        const goldMin = this.treasureDropList.gold_min;
        const goldRange = this.treasureDropList.gold_max - goldMin;
        const randomAward = Math.floor(Math.random() * goldRange) + goldMin;
        const awardGold = (this.treasureDropList.gold_chance / 1000) > Math.random();

        if (awardGold) {
          adventurer.creditAccount(randomAward);
        }
        if (itemDropped) {
          // compose payload for Item constructor
          const payload = items.composePayloadFromProto(treasure);
          let itemId = items.createItem(payload);
          const treasureItem = items.getItem(itemId);
          adventurer.considerTreasure(treasureItem);
        }
        resolve();
        return;
      } else if (trapProb > treasureProb && trapProb > encounterProb) {
        adventurer.encounterTrap(this.number);
        resolve();
        return;
      } else if (encounterProb > trapProb && encounterProb > treasureProb) {
        console.log('perform encounter');
        const monsterIndex = Math.floor(Math.random() * this.monsters.length);
        const monsterProto = this.monsters[monsterIndex];
        const monsterPayload = monsters.composePayloadFromProto(monsterProto);
        const newMonsterId = monsters.createMonster(monsterPayload);
        const newMonster = monsters.getMonster(newMonsterId);
        adventurer.setWeaknessChecked(false);
        adventurer.logEncounterStart(newMonster.name);
        const newBattle = new Battle({ adventurer: adventurer, monster: newMonster, level: this.number, levelLoot: this.monstersLoot });
        battleController.addBattle(newBattle);
        newBattle.startBattle(resolve);
        console.log('battle created.');
      }
    });
    
  }

  const BattleController = function() {
    this.currentBattles = [];
    this.currentBattleId = 0;
  }

  BattleController.prototype.addBattle = function(battle) {
    battle.id = this.currentBattleId;
    this.currentBattles.push(battle);
    this.currentBattleId++;
    return battle.id;
  }

  BattleController.prototype.clearBattleRound = function(payload) {
    const {
      roundNumber,
      battleId
    } =  payload;
    const foundBattle = this.currentBattles.find(battle => battle.id === battleId);
    foundBattle.clearRound(roundNumber);
  }

  BattleController.prototype.addBattleRound = function(payload) {
    const {
      battleId,
      newRound
    } = payload;
    const foundBattle = this.currentBattles.find(battle => battle.id === battleId);
    foundBattle.addRound(newRound);
  }

  BattleController.prototype.getBattleLevelLoot = function(battleId) {
    const foundBattle = this.currentBattles.find(battle => battle.id === battleId);
    return foundBattle.levelLoot;
  }

  const Battle = function(payload) {
    const {
      adventurer,
      monster,
      level,
      levelLoot
    } = payload;
    this.adventurer = adventurer;
    this.monster = monster;
    this.rounds = [];
    this.currentRoundNumber = 0;
    this.level = level;
    this.levelLoot = levelLoot;
  }

  Battle.prototype.startBattle = function(turnResolve) {
    this.resolution = turnResolve;
    const newRound = new Round({ adventurer: this.adventurer,
      monster: this.monster,
      battleId: this.id });
    this.addRound(newRound);
    newRound.startRound();
  }

  Battle.prototype.addRound = function(round) {
    round.roundNumber = this.currentRoundNumber;
    this.currentRoundNumber++;
    this.rounds.push(round);
  }

  Battle.prototype.clearRound = function(roundNumber) {
    let deletedRound = this.rounds.find(foundRound => foundRound.roundNumber === roundNumber);
    if (deletedRound.fleed) {
      const thisLevel = levels.find(level => level.number === this.level);
      thisLevel.lurkingMonsters.push(this.monster);
    }
    this.rounds = this.rounds.filter(clearRound => clearRound.roundNumber !== roundNumber);
    if (deletedRound) {
      deletedRound = null;
    }
    if (this.rounds.length === 0) {
      this.resolution();
    }
  }

  const Round = function(payload) {
    const {
      adventurer,
      monster,
      battleId
    } = payload;
    this.battleId = battleId;
    this.adventurer = adventurer;
    this.monster = monster;
    this.fleed = false;
  }

  Round.prototype.startRound = function() {
    const actions = adventurersModule.getActions();
    // console.log(`Round number: ${this.roundNumber}`);
    const adventurerInitiative = this.adventurer.getInitiativeRoll();
    const monsterInitiative = this.monster.getInitiativeRoll();
    if (this.adventurer.action.currentAction === actions.setTrap) {
      const trapDamage = this.monster.takeTrapDamage(this.adventurer.level);
      this.adventurer.logTrap({ trapDamage, monsterName: this.monster.name });
      this.adventurer.unsetTrap();
    }
    if (adventurerInitiative > monsterInitiative) {
      this.adventurerTurn();
      if (this.monster.hp > 0 && !this.fleed) {
        this.monsterTurn();
      }
    } else {
      this.monsterTurn();
      if (this.adventurer.hp > 0) {
        this.adventurerTurn();
      }
    }
    if (this.adventurer.hp > 0 && this.monster.hp > 0 && !this.fleed) {
      this.addRound();
    } 
    this.clearSelf();
  }

  Round.prototype.adventurerTurn = function() {
    console.log('adventurer turn');
    const battleDecisions = adventurersModule.getBattleDecisions();
    const adventurerMove = this.adventurer.getBattleDecision(this.monster);
    if (adventurerMove === battleDecisions.defend) {
      this.adventurer.defending = true;
      this.adventurer.logDefend();
    } else {
      this.adventurer.defending = false;
    }
    if (adventurerMove === battleDecisions.usePotion) {
      this.adventurer.usePotion();
    }
    if (adventurerMove === battleDecisions.flee) {
      const doBlock = this.monster.checkBlockFlee();
      if (doBlock) {
        const levelDiff = this.monster.level - this.adventurer.level;
        let fleeFactor = .05 + (levelDiff / 10);
        const doesFlee = fleeFactor > Math.random();
        if (doesFlee) {
          this.fleed = true;
          this.adventurer.logFlee();
        } 
      } else {
        this.fleed = true;
        this.adventurer.logFlee();
      }
    }
    if (adventurerMove === battleDecisions.checkWeakness) {
      this.adventurer.setWeaknessChecked(true);
      this.adventurer.logWeaknessChecked({ monsterName: this.monster.name });
    }
    if (adventurerMove === battleDecisions.attack) {
      let damageFactor = 0;
      if (this.adventurer.adventurerClass.name === 'thief') {
        damageFactor = Math.floor(this.adventurer.cunning * .75) + this.adventurer.strength;
      } else if (this.adventurer.adventurerClass.name === 'bard') {
        damageFactor = Math.floor(this.adventurer.cunning * .5) + this.adventurer.strength;
      } else if (this.adventurer.adventurerClass.name === 'soldier') {
        damageFactor = Math.floor(this.adventurer.cunning * .2) + this.adventurer.strength;
      } else {
        damageFactor = this.adventurer.strength;
      }
      let weaponDamage = 0;
      if (this.adventurer.equipment.weapon) {
        weaponDamage = this.adventurer.equipment.weapon.damage;
      }
      const damageFloor = Math.floor(damageFactor / 2);
      const randomizeDamage = damageFactor - damageFloor;
      const randomDamage = Math.floor(Math.random() * randomizeDamage);
      const monsterShield = Math.floor(Math.random() * (this.monster.defense * .5) + (this.monster.defense * .5));
      let calculatedDamage = damageFloor + randomDamage + weaponDamage - monsterShield;
      if (this.monster.defending) {
        calculatedDamage = Math.floor(calculatedDamage / 2);
      }
      if (this.adventurer.weaknessChecked) {
        const ampDamage = calculatedDamage * (Math.floor(1.3 * Math.pow(1.14, this.adventurer.cunning)));
        calculatedDamage = ampDamage;
      }
      calculatedDamage = Number.parseInt(calculatedDamage);
      if (calculatedDamage < 1) {
        if (Math.random() > .5) {
          calculatedDamage = 1;
        } else {
          calculatedDamage = 0;
        }
      }
      if (calculatedDamage > this.monster.hp) {
        calculatedDamage = this.monster.hp;
      }
      this.monster.takeBattleDamage(calculatedDamage);
      const damagePayload = {
        monsterName: this.monster.name,
        damage: calculatedDamage
      }
      this.adventurer.logHitMonster(damagePayload);
      if (this.monster.hp <= 0) {
        this.adventurer.gainExperience(this.monster.experience);
        console.log('monster treasure event');
        console.log(this.monster.dropList.drops);
        // const treasureIndex = Math.floor(Math.random() * this.monster.dropList.drops.length);
        let treasureLevelReference = battleController.getBattleLevelLoot(this.battleId);
        let treasureMonsterRef = this.monster.dropList.drops;
        console.log(treasureLevelReference);
        console.log(treasureMonsterRef);
        // let treasures = treasureMonsterRef.map(monsterRef => {
        //   const treasureRef = treasureLevelReference.find(item => item.)
        // })
        // const treasure = treasures[treasureIndex];
        // const treasureDropRef = this.treasureDropList.drops.find(drop => drop.itemId === treasure.id);
        // const itemDropped = (treasureDropRef.dropChance / 1000) > Math.random();
        // const goldMin = this.treasureDropList.gold_min;
        // const goldRange = this.treasureDropList.gold_max - goldMin;
        // const randomAward = Math.floor(Math.random() * goldRange) + goldMin;
        // const awardGold = (this.treasureDropList.gold_chance / 1000) > Math.random();

        // if (awardGold) {
        //   adventurer.creditAccount(randomAward);
        // }
        // if (itemDropped) {
        //   // compose payload for Item constructor
        //   const payload = items.composePayloadFromProto(treasure);
        //   let itemId = items.createItem(payload);
        //   const treasureItem = items.getItem(itemId);
        //   adventurer.considerTreasure(treasureItem);
        // }

        this.adventurer.logVictory({ monsterName: this.monster.name });
      }
    }
  }

  Round.prototype.monsterTurn = function() {
    const monsterDecisions = monsters.getMonsterDecisions();
    const monsterMove = this.monster.getBattleDecision();
    if (monsterMove === monsterDecisions.defend) {
      this.monster.defending = true;
    } else {
      this.monster.defending = false;
    }
    if (monsterMove === monsterDecisions.attack) {
      const damageFloor = Math.floor(this.monster.damage / 2);
      const randomizeDamage = this.monster.damage - damageFloor;
      const randomDamage = Math.floor(Math.random() * randomizeDamage);
      const adventurerShield = Math.floor((this.adventurer.adventurerClass.armor + Math.floor(this.adventurer.adventurerClass.tactics / 2)) / 2);
      let adventurerArmor = 0;
      if (this.adventurer.equipment.armor) {
        adventurerArmor = this.adventurer.equipment.armor.armor;
      }
      // console.log(`damage: ${damageFloor + randomDamage}, shield: ${adventurerShield}`);
      let calculatedDamage = damageFloor + randomDamage - adventurerShield - adventurerArmor;
      if (this.adventurer.defending) {
        calculatedDamage = Math.floor(calculatedDamage / 2);
      }
      if (calculatedDamage < 1) {
        if (Math.random() > .5) {
          calculatedDamage = 1;
        } else {
          calculatedDamage = 0;
        }
      }
      const damagePayload = {
        monsterName: this.monster.name,
        damage: calculatedDamage
      }
      this.adventurer.takeBattleDamage(damagePayload);
    }
  }

  Round.prototype.addRound = function() {
    const newRound = new Round({ adventurer: this.adventurer, monster: this.monster, battleId: this.battleId });
    battleController.addBattleRound({ newRound, battleId: this.battleId });
    newRound.startRound();
  }

  Round.prototype.clearSelf = function() {
    battleController.clearBattleRound({ roundNumber: this.roundNumber, battleId: this.battleId });
  }

  let battleController;

  const initializeBattleController = function() {
    battleController = new BattleController();
  }

  const dispatchLevels = function() {
    const payload = {
      type: SET_DUNGEON_LEVELS,
      payload: levels
    };
    store.dispatch(payload);
  }

  const dispatchExploredLevel = function() {
    const payload = {
      type: SET_DUNGEON_LEVEL_EXPLORED,
      level: exploredLevel
    }
    store.dispatch(payload);
  }

  const dispatchAdventurers = function() {
    const payload = {
      type: SET_DUNGEON_ADVENTURERS,
      adventurers: adventurers
    }
    store.dispatch(payload);
  }

  const orderLevels = function() {
    levels.sort((level1, level2) => {
      if (level1.number > level2.number) {
        return 1;
      } else if (level1.number < level2.number) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  const fetchLevels = async function() {
    let initLevels = fetcher.fetchRoute('levels-full');
    return initLevels;
  }

  const getLevels = function*() {
    yield fetchLevels();
  }

  const addAdventurer = function(adventurerId) {
    adventurers.push({ adventurerId: adventurerId, level: 1});
    if (exploredLevel < 1) {
      exploredLevel = 1;
      dispatchExploredLevel();
    }
  }

  const deleteAdventurer = function(adventurerId) {
    adventurers = adventurers.filter(adventurer => adventurer.adventurerId !== adventurerId);
  }

  const getMonstersForLevel = function*(minLevel, maxLevel) {
    yield fetchMonstersInRange(minLevel, maxLevel);
  }

  const fetchMonstersInRange = async function(minLevel, maxLevel) {
    const fetchUrl = `/monsters-in-level-range?min-level=${minLevel}&max-level=${maxLevel}`;
    let fetchedMonsters;
    try {
      fetchedMonsters = await fetch(fetchUrl);
    } catch (err) {
      console.log(err);
    }

    if (fetchedMonsters) {
      fetchedMonsters = fetchedMonsters.json();
    }

    return fetchedMonsters;
  }

  const getDrop = function*(drop) {
    yield fetchDrop(drop);
  }

  const fetchDrop = async function(drop) {
    const fetchUrl = `/${drop.dropType}-id?id=${drop.itemId}`;
    let fetchedDrop;
    try {
      fetchedDrop = await fetch(fetchUrl);
    } catch (err) {
      console.log(err);
    }

    if (fetchedDrop) {
      fetchedDrop = fetchedDrop.json();
    }
  
    return fetchedDrop;
  }

  const loadLevel = async function() {
    return new Promise((resolve, reject) => {
      const nextLevelN = exploredLevel + 1;
      let nextLevel = levels.find(level => level.number === nextLevelN);
      nextLevel.initialize()
        .then((completed) => {
          resolve(completed);
        })
      })
  }

  return {
    initializeLevels: async function() {
      initializeBattleController();
      const genGetLevels = getLevels();
      genGetLevels.next().value
        .then(initLevels => {
          if (!initLevels) return false;
          while (initLevels.length > 0) {
            let newLevel = initLevels.shift();
            if (Array.isArray(newLevel)) {
              newLevel = newLevel[0];
            }
            const levelPayload = {
              number: newLevel.number,
              boss: newLevel.boss,
              bossId: newLevel.boss_id,
              monstersMinLevel: newLevel.monsters_min_level,
              monstersMaxLevel: newLevel.monsters_max_level,
              tileAssignments: newLevel.tile_assignments,
              treasureDropList: newLevel.drop_list
            }
            let thisLevel = new Level(levelPayload);
            levels.push(thisLevel);
          }
        }).then(() => {
          levelCount = levels.length;
          orderLevels();
          dispatchLevels();
          dispatchExploredLevel();
        });
    },
    updateLevels: function() {
      dispatchLevels();
    },
    getExploredLevel: function() {
      return exploredLevel;
    },
    receiveAdventurer: function(adventurerId) {
      addAdventurer(adventurerId);
      dispatchAdventurers();
    },
    releaseAdventurer: function(adventurerId) {
      deleteAdventurer(adventurerId);
      dispatchAdventurers();
    },
    executeTurn: async function(adventurer) {
      return new Promise((resolve, reject) => {
        const dungeonEntry = adventurers.find(dunAdventurer => dunAdventurer.adventurerId === adventurer.id);
        const currentLevel = levels.find(level => level.number === dungeonEntry.level);
        currentLevel.activateTile(adventurer)
          .then(() => {
            resolve();
          });
      })
    },
    checkLevelReadiness: function() {
      if (exploredLevel === 0) return false;
      if (!adventurers) return false;
      let highestLevel = 1;
      for (let adventurerI = 0; adventurerI < adventurers.length; adventurerI++) {
        if (adventurers[adventurerI].level > highestLevel) {
          highestLevel = adventurers[adventurerI].level;
        }
      }
      if (exploredLevel <= highestLevel) {
        if (exploredLevel < levelCount) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    loadNextLevel: function*() {
      yield loadLevel();
    }
  }
}());

export default dungeon;