const items = (function(){
  const itemTypes = {
    potion: 'potion',
    weapon: 'weapon',
    armor: 'armor'
  }

  const potionTypes = {
    healing: 'healing'
  }
  
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
    createItem: function(type, name, value, payload) {
      if (!type[type]) {
        console.log('invalid item type passed to items.createItem()');
        return;
      }
      
      const newItem = new Item(type, name, value);
      
      switch (newItem.type) {
        case itemTypes.potion:
          const newPotionType = payload.type;  
          if (!newPotionType) {
            console.log('attempted to create invalid potion type');
            return;
          }
          const newPotionLevel = payload.level;
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
      const newItem = new Item(itemTypes.potion, 'Healing Potion', 60);
      newItem[itemTypes.potion] = new Potion(potionTypes.healing, lvl);
      return newItem;
    },

    getItemTypes: function() {
      return itemTypes;
    }
  }
}());

export default items;