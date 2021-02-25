const monsters = (function(){
  let currentId = 0;

  let monsters = [];

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
    currentId++;
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
    }
  }
}());

export default monsters;