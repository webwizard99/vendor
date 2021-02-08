// game imports

// utility imports
import fetcher from '../Utilities/fetcher';

// redux imports
import { store } from '../index';
import { SET_DUNGEON_LEVELS, SET_DUNGEON_LEVEL_EXPLORED } from '../actions/types';

const dungeon = (function(){
  let levels = [];
  let adventurers = [];

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
    this.monsters = [];
    this.monstersLoot = [];
    this.treasureListFetched = false;
    this.monstersFetched = false;
    this.monsterDropListItemsFetched = false;
    this.intialized = false;
  }

  Level.prototype.initialize = function() {
    console.log('level initialize');
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
      const levelOne = levels.find(level => level.number === 1);
      console.log(levelOne);
      if (!levelOne) return false;
      levelOne.initialize();
      exploredLevel = 1;
    }
    console.log('adventurer added to dungeon');
  }

  const deleteAdventurer = function(adventurerId) {
    adventurers = adventurers.filter(adventurer => adventurer.adventurerId !== adventurerId);
  }

  return {
    initializeLevels: async function() {
      const genGetLevels = getLevels();
      genGetLevels.next().value
        .then(initLevels => {
          console.log(initLevels);
          if (!initLevels) return false;
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
        });
      orderLevels();
      dispatchLevels();
      dispatchExploredLevel();
      console.log(levels);
    },
    updateLevels: function() {
      dispatchLevels();
    },
    getExploredLevel: function() {
      return exploredLevel;
    },
    receiveAdventurer: function(adventurerId) {
      addAdventurer(adventurerId);
    },
    releaseAdventurer: function(adventurerId) {
      deleteAdventurer(adventurerId);
    }
  }
}());

export default dungeon;