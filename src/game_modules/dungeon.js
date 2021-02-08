// game imports

// utility imports
import fetcher from '../Utilities/fetcher';

// redux imports
import { store } from '../index';
import { SET_DUNGEON_LEVELS, 
  SET_DUNGEON_LEVEL_EXPLORED,
  SET_DUNGEON_ADVENTURERS } from '../actions/types';

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
    const tGetMonstersForLevel = getMonstersForLevel(this.monstersMinLevel, this.monstersMaxLevel);
    //const monstersToAdd = getMonstersForLevel(this.monstersMinLevel, this.monstersMaxLevel);
    tGetMonstersForLevel.next().value.then((monstersToAdd) => {
      console.log(monstersToAdd);
      if (!monstersToAdd) return false;
      let monsterDrops = [];
      monstersToAdd.forEach(addMonster => {
        this.monsters.push(addMonster);
        const addMonsterDrops = addMonster.drop_list.drops;
        if (addMonsterDrops) {
          addMonsterDrops.forEach(addDrop => {
            const addId = addDrop.itemId;
            if (!monsterDrops.find(item => item.itemId === addId)) {
              // get item
              monsterDrops.push({ itemId: addId, dropType: addDrop.drop_type});
            }
          })
        }
      });
      console.log(monsterDrops);
      const mGetDrops = getDrops(monsterDrops);
      mGetDrops.next().value.then((resolvedDrops) => {
        console.log(resolvedDrops);
        this.monstersLoot = resolvedDrops;
      });
      let treasureDrops = [];
      this.treasureDropList.drops.forEach(drop => {
        const addId = drop.itemId;
        if (!treasureDrops.find(item => item.itemId === addId)) {
          treasureDrops.push({ itemId: addId, dropType: drop.drop_type });
        }
      });
      console.log(treasureDrops);
      const tGetDrops = getDrops(treasureDrops);
      tGetDrops.next().value.then((resolvedDrops) => {
        console.log(resolvedDrops);
        this.treasures = resolvedDrops;
      });
      console.log(this);
    })
    
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
      const levelOne = levels.find(level => level.number === 1);
      if (!levelOne) return false;
      levelOne.initialize();
      exploredLevel = 1;
      dispatchExploredLevel();
    }
    console.log('adventurer added to dungeon');
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

  const getDrops = function*(listOfDrops) {
    yield fetchDrops(listOfDrops);
  }

  const fetchDrops = async function(listOfDrops) {
    let fetchedDrops = [];
    listOfDrops.forEach(async (dropToFetch)  => {
      const fetchUrl = `/${dropToFetch.dropType}-id?id=${dropToFetch.itemId}`;
      let fetchedDrop;
      try {
        fetchedDrop = await fetch(fetchUrl);
      } catch (err) {
        console.log(err);
      }

      if (fetchedDrop) {
        fetchedDrop = fetchedDrop.json();
      }
      fetchedDrops.push(fetchedDrop)
    });
    Promise.all(...fetchedDrops)
      .then((resultDrops) => {
        console.log(resultDrops);
        return resultDrops;
      });
    
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
          orderLevels();
          dispatchLevels();
          dispatchExploredLevel();
          console.log(levels);
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
    }
  }
}());

export default dungeon;