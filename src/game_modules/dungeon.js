// game imports
import items from './items';
import adventurersModule from './adventurers';

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
        innTreasureBoost = 200;
      }
      const actions = adventurersModule.getActions();;
      let checkTreasureBoost = 0;
      if (adventurer.action === actions.checkForTreasure) {
        checkTreasureBoost = 100;
      }
      let checkTrapBoost = 0;
      if (adventurer.action === actions.checkForTraps) {
        checkTrapBoost = 125;
      }
      const treasureProb = Math.random() * (resultTile.treasure + innTreasureBoost + checkTreasureBoost);
      const encounterProb = Math.random() * resultTile.encounter;
      const trapProb = Math.random() * (resultTile.trap - checkTrapBoost);
      const threshholdProb = Math.random() * 125;
      console.log(`probs... treasure: ${treasureProb}, trap: ${trapProb}, encounter: ${encounterProb}, threshold: ${threshholdProb}`);
      if (threshholdProb > treasureProb && threshholdProb > encounterProb && threshholdProb > trapProb) {
        resolve();
        return;
      }
      if (treasureProb > encounterProb && treasureProb > trapProb) {
        console.log('treasure event');
        const treasureIndex = Math.floor(Math.random() * this.treasures.length);
        const treasures = this.treasures;
        const treasure = treasures[treasureIndex];
        // compose payload for Item constructor
        const payload = items.composePayloadFromProto(treasure);
        let itemId = items.createItem(payload);
        const treasureItem = items.getItem(itemId);
        adventurer.considerTreasure(treasureItem);
      } else if (trapProb > treasureProb && trapProb > encounterProb) {
        adventurer.encounterTrap(this.number);
      } else if (encounterProb > trapProb && encounterProb > treasureProb) {
        console.log('perform encounter');
      }
      resolve();
    });
    
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