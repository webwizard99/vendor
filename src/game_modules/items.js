import ItemTypes from '../Utilities/itemTypes';
import PotionTypes from '../Utilities/potionTypes';

const items = (function(){
  const itemTypes = ItemTypes;
  const potionTypes = PotionTypes;

  let allItems = [];
  let lastIndex = 0;
  
  const Item = function(payload) {
    const { type, name, value } = payload;
    this.type = type;
    this.name = name;
    this.value = value;
    this.id = lastIndex;
    lastIndex++;
  }

  const Potion = function(payload) {
    const { type, level } = payload;
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
      
      const newPayload = { type, name, value }
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
      newItem[itemTypes.potion] = new Potion(potionTypes.healing, lvl);
      return newItem;
    },

    getItemTypes: function() {
      return itemTypes;
    }
  }
}());

export default items;