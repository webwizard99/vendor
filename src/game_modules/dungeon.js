// game imports

// utility imports
import fetcher from '../Utilities/fetcher';

// redux imports
import { store } from '../index';
import { SET_DUNGEON_LEVELS } from '../actions/types';

const dungeon = (function(){
  let levels = [];

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
  }

  const dispatchLevels = function() {
    const payload = {
      type: SET_DUNGEON_LEVELS,
      payload: levels
    };
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

  return {
    initializeLevels: async function() {
      const genGetLevels = getLevels();
      genGetLevels.next().value
        .then(initLevels => {
          if (!initLevels) return false;
          let newLevel = initLevels.shift();
          newLevel = newLevel[0];
          const levelPayload = {
            number: newLevel.number,
            boss: newLevel.boss,
            bossId: newLevel.boss_id,
            monstersMinLevel: newLevel.monsters_min_level,
            monstersMaxLevel: newLevel.monsters_max_level,
            tileAssignments: newLevel.tile_assignments,
            treasureDropList: newLevel.dropList
          }
          let thisLevel = new Level(levelPayload);
          levels.push(thisLevel);
        });
      orderLevels();
      dispatchLevels();
      console.log(levels);
    },
    updateLevels: function() {
      dispatchLevels();
    }
  }
}());

export default dungeon;