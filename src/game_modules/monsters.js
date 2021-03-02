const monsters = (function(){
  let currentId = 0;

  let monsters = [];
  const specialCooldownTurns = 4;

  const monsterDecisions = {
    heal: 'heal',
    defend: 'defend',
    special: 'special',
    attack: 'attack'
  }

  const Monster = function(payload) {
    const {
      protoId,
      name,
      boss,
      level,
      hp,
      damage,
      defense,
      stealth,
      initiative,
      special,
      heal,
      dropList,
      monsterBehavior
    } = payload;
    this.protoId = protoId;
    this.name = name;
    this.boss = boss;
    this.level = level;
    this.hp = hp;
    this.maxHp = hp;
    this.damage = damage;
    this.defense = defense;
    this.stealth = stealth;
    this.initiative = initiative;
    this.special = special;
    this.heal = heal;
    this.dropList = dropList;
    this.monsterBehavior = monsterBehavior;
    this.id = currentId;
    this.specialCooldown = specialCooldownTurns;
    this.defending = false;
    currentId++;
  }

  Monster.prototype.getInitiativeRoll = function() {
    const initiativeFactor = ((this.initiative * .9) + (this.stealth * .3)) / 10;
    return Math.random() * initiativeFactor;
  }

  Monster.prototype.takeTrapDamage = function(adventurerLevel) {
    let trapDamage = Math.floor(3 * (Math.pow(1.25, (adventurerLevel - 1))));
    if (trapDamage > this.hp) {
      trapDamage = this.hp;
    }
    this.hhp -= trapDamage;
    return trapDamage;
  }

  Monster.prototype.checkNeedsHeal = function() {
    const hpDifferential = this.maxHp - this.hp;
    const percentLost = hpDifferential / this.maxHp;
    const needHealing = percentLost > Math.random();
    return needHealing;
  }

  Monster.prototype.checkUseHeal = function() {
    let decisionFactor = (this.monsterBehavior.heal / 1000);
    const useHeal = decisionFactor > Math.random();
    return useHeal;
  }

  Monster.prototype.checkUseSpecial = function() {
    let decisionFactor = (this.monsterBehavior.special_move / 1000);
    const useSpecial = decisionFactor > Math.random();
    return useSpecial;
  }

  Monster.prototype.checkDefend = function() {
    if (this.defending) return false;
    let decisionFactor = (this.monsterBehavior.defend / 1000);
    const useDefend = decisionFactor > Math.random();
    return useDefend;
  }

  Monster.prototype.getBattleDecision = function() {
    let thisDecision = new MonsterDecision(this.id);
    if (this.monsterBehavior.heal) {
      thisDecision.needHealing = this.checkNeedsHeal();
      thisDecision.useHeal = this.checkUseHeal();
    }
    if (this.monsterBehavior.special_move) {
      thisDecision.useSpecial = this.checkUseSpecial();
    }
    thisDecision.defend = this.checkDefend();
    const decided = thisDecision.weighDecisionTournament();
    console.log(decided);
    return decided;
  }

  const MonsterDecision = function(monsterId) {
    this.monsterId = monsterId;
    this.needHealing = false;
    this.useHeal = false;
    this.useSpecial = false;
    this.defend = false;
  }

  MonsterDecision.prototype.weighDecisionTournament = function() {
    const concernedMonster = monsters.find(monster => monster.id === this.monsterId);
    let remainingOptions = [];
    // populate hash table with weights for relevant behaviors
    const weights = {
      useHeal: concernedMonster.monsterBehavior.heal,
      useSpecial: concernedMonster.monsterBehavior.special_move,
      defend: concernedMonster.monsterBehavior.defend
    }
    // add decisions marked as valid to array for use in
    // creating elimination tournament
    if (this.needHealing && this.useHeal) {
      remainingOptions.push(monsterDecisions.heal);
    }
    if (this.useSpecial) {
      remainingOptions.push(monsterDecisions.special);
    }
    if (this.defend) {
      remainingOptions.push(monsterDecisions.defend);
    }
    remainingOptions.push(monsterDecisions.attack);
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
      for (let offset = 0; offset < pairCount; offset++) {
        const pair = [remainingOptions[offset], remainingOptions[optionsLength - (offset + 1)]];
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
          eliminated.push(pair[1]);
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

  return {
    createMonster: function (payload) {
      const newMonster = new Monster(payload);
      monsters.push(newMonster);
      return newMonster.id;
    },
    getMonster: function(id) {
      const foundMonster = monsters.find(monster => monster.id === id);
      if (foundMonster !== undefined && foundMonster !== null) {
        return foundMonster;
      } else {
        return false;
      }
    },
    composePayloadFromProto: function(protoMonster) {
      const monsterPayload = {
        protoId: protoMonster.id,
        name: protoMonster.name,
        boss: protoMonster.boss,
        level: protoMonster.level,
        hp: protoMonster.hp,
        damage: protoMonster.damage,
        defense: protoMonster.defense,
        stealth: protoMonster.stealth,
        initiative: protoMonster.initiative,
        special: protoMonster.special,
        heal: protoMonster.heal,
        dropList: protoMonster.drop_list,
        monsterBehavior: protoMonster.monster_behavior
      }
      return monsterPayload;
    },
    getMonsterDecisions: function() {
      return monsterDecisions;
    }
  }
}());

export default monsters;