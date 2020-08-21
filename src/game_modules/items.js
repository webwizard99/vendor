import ItemTypes from '../Utilities/itemTypes';
import PotionTypes from '../Utilities/potionTypes';

const items = (function(){
  const itemTypes = ItemTypes;

  const potionTypes = PotionTypes;
  
  const Item = function(type, name, value) {
    this.type = type;
    this.name = name;
    this.value = value;
  }

  const Potion = function(type, level) {
    this.type = type;
    this.level = level;
  }
  
  return {
    createItem: function(payload) {
      let { type, name, value, itemPayload } = payload;
      if (!type[type]) {
        console.log('invalid item type passed to items.createItem()');
        return;
      }
      
      const newItem = new Item(type, name, value);
      
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
          newItem[newItem.type] = new Potion(newPotionType, newPotionLevel);
          break;
        default:
          break;
      }
      return newItem;
    },

    createTestPotion: function(lvl) {
      const newItem = new Item({ type: itemTypes.potion, name: 'Healing Potion', value: 60});
      newItem[itemTypes.potion] = new Potion(potionTypes.healing, lvl);
      return newItem;
    },

    getItemTypes: function() {
      return itemTypes;
    }
  }
}());

export default items;