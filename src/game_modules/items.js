import ItemTypes from '../Utilities/itemTypes';
import PotionTypes from '../Utilities/potionTypes';

const items = (function(){
  const itemTypes = ItemTypes;
  const potionTypes = PotionTypes;

  let allItems = [];
  let lastIndex = 0;
  
  const Item = function(payload) {
    const { type, name, value, prototypeId } = payload;
    this.type = type;
    this.name = name;
    this.value = value;
    this.prototypeId = prototypeId;
    this.id = lastIndex;
    lastIndex++;
  }

  const Potion = function(payload) {
    const { type, level } = payload;
    this.type = type;
    this.level = level;
  }

  const Weapon = function(payload) {
    const { damage, level } = payload;
    this.damage = damage;
    this.level = level;
  }

  const Armor = function(payload) {
    const { armor, level } = payload;
    this.armor = armor;
    this.level = level;
  }
  
  return {
    createItem: function(payload) {
      let { type, name, value, itemPayload } = payload;
      if (!itemTypes[type]) {
        console.log('invalid item type passed to items.createItem()');
        return;
      }
      
      const newPayload = { type: type , name: name , value: value }
      const newItem = new Item(newPayload);
      
      switch (newItem.type) {
        case itemTypes.potion:
          const newPotionType = itemPayload.type;  
          if (!newPotionType) {
            console.log('attempted to create invalid potion type');
            return;
          }
          const newPotionLevel = itemPayload.level;
          if (!newPotionLevel) {
            console.log('attempted to create a potion with an invalid level');
            return;
          }
          const potionPayload = { type: newPotionType, level: newPotionLevel };
          newItem[newItem.type] = new Potion(potionPayload);
          break;
        case itemTypes.weapon:
          const newWeaponDamage = itemPayload.damage;
          if (!newWeaponDamage) {
            console.log('attempted to create a weapon without damage');
            return;
          }
          const newWeaponLevel = itemPayload.level;
          if (!newWeaponLevel) {
            console.log('attempted to create a weapon with an invalid level');
            return;
          }
          const weaponPayload = { damage: newWeaponDamage, level: newWeaponLevel };
          newItem[newItem.type] = new Weapon(weaponPayload);
          break;
        case itemTypes.armor:
          const newArmorArmor = itemPayload.armor;
          if (!newArmorArmor) {
            console.log('attempted to make a new armor without an armor value');
            return;
          }
          const newArmorLevel = itemPayload.level;
          if (!newArmorLevel) {
            console.log('attempted to make a new armor without a level value');
            return;
          }
          const armorPayload = { armor: newArmorArmor, level: newArmorLevel };
          newItem[newItem.type] = new Armor(armorPayload);
          break;
        default:
          break;
      }

      allItems.push(newItem);
      return newItem.id;
    },

    getItem(id) {
      let thisItem = allItems.find(item => item.id === id);
      if (thisItem) {
        return thisItem;
      } else {
        console.log('attempted to retrieve invalid item.')
      }
    },

    createTestPotion: function(lvl) {
      const newItem = new Item({ type: itemTypes.potion, name: 'Healing Potion', value: 60});
      newItem[itemTypes.potion] = new Potion({ type: potionTypes.healing, level: lvl});
      return newItem;
    },

    getItemTypes: function() {
      return itemTypes;
    }
  }
}());

export default items;